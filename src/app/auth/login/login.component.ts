import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { LoginForm } from '../../interfaces/login/login_form.inteface';
import { LoginResponse } from '../../interfaces/login/login_response.interface';
import { ConversationService } from '../../services/conversation.service';
import { FollowService } from '../../services/follow.service';
import { EventService } from 'src/app/services/event.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ServiceOffersService } from '../../services/service_offers.service';
import { ServiceRequestsService } from '../../services/service_requests.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public loginForm: LoginForm;
  public formSubmitted = false;
  public site_key: any;
  public validCaptcha = false;
  @ViewChild('captchaElem') captcha: RecaptchaComponent;

  public authentication_code = '';
  public displaying_two_factor_auth_modal = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowService,
    private readonly event_service: EventService,
    private readonly service_offers_service: ServiceOffersService,
    private readonly service_requests_service: ServiceRequestsService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    this.site_key = '6Le-PfMdAAAAAIM0bEC7_TxiGoL5J-8YkcAC4R0-';
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          ),
        ],
      ],
      recaptcha: ['', Validators.required],
    });
  }

  async saveForm(): Promise<void> {
    this.formSubmitted = true;
    if (this.form.invalid || !this.validCaptcha) {
      this.captcha.reset();
      this.validCaptcha = false;
      return;
    }
    this.loginForm = this.form.value;

    this.authService.loginUser(this.loginForm).subscribe(
      (result: LoginResponse) => {
        if (!result.id) {
          const { access_token } = result;
          const now = new Date();
          now.setSeconds(7200);
          this.authService
            .setSessionData({
              user_id: null,
              customer_id: null,
              user_email: null,
              user_roles: null,
              access_token,
              expires_date: now.getTime().toString(),
              is_two_factor_auth_enabled: result.is_two_factor_auth_enabled,
            })
            .subscribe(() => {
              this.displaying_two_factor_auth_modal = true;
            });
        } else {
          this.effectuateLogin(result);
        }
      },
      (err) => {
        Swal.fire('Error', err.error.error, 'error');
      }
    );
  }

  public submitAuthenticationCode() {
    this.authService.turnOnQRCode(this.authentication_code).subscribe(() => {
      this.authService
        .authenticateTwoFactor(this.authentication_code)
        .subscribe(
          (result: LoginResponse) => {
            this.effectuateLogin(result);
          },
          (err) => {
            Swal.fire('Error', err.error.error, 'error');
          }
        );
    });
  }

  private effectuateLogin(result: LoginResponse) {
    const { id, customer_id, email, roles, access_token } = result;
    const now = new Date();
    now.setSeconds(7200);
    this.authService
      .setSessionData({
        user_id: id,
        customer_id,
        user_email: email,
        user_roles: roles,
        access_token,
        expires_date: now.getTime().toString(),
        is_two_factor_auth_enabled: result.is_two_factor_auth_enabled,
      })
      .subscribe(() => {
        this.follow_service.getAndStoreUserFollowCollection();
        this.conversation_service.getAndStoreConversations();
        this.event_service.getAndStoreMyEventsCollection();
        this.event_service.getAndStoreMyAssistancesCollection();
        this.service_offers_service.getAndStoreMyServiceOfferCollection();
        this.service_requests_service.getAndStoreMyServiceRequestCollection();
        this.router.navigate(['/main/feed']);
      });
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid && this.formSubmitted;
  }

  resolved(captcha_response: string) {
    return this.authService.verifyCaptcha(captcha_response).subscribe(
      (res: any) => {
        this.validCaptcha = res.success;
      },
      () => {
        this.validCaptcha = false;
      }
    );
  }
}
