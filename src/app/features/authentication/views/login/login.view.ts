import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LoginResponse } from '../../types/login_response.interface'
import { Component, OnInit } from '@angular/core'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { AuthService } from '../../../../core/service/auth.service'
import { LoginForm } from '../../types/login_form.inteface'
import { auth_routing_paths } from '../../auth.routing'
import { feed_routing_paths } from '../../../feed/feed.routing'

@Component({
  selector: 'skl-login',
  templateUrl: './login.view.html',
  styleUrls: ['./login.view.css'],
})
export class LoginView implements OnInit {
  paths = auth_routing_paths;

  public form: FormGroup;
  public loginForm: LoginForm;
  public formSubmitted = false;

  public authentication_code = '';
  public displaying_two_factor_auth_modal = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
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
      ]
    });
  }

  async saveForm(): Promise<void> {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loginForm = this.form.value;
    this.authService.loginUser(this.loginForm).subscribe(
      ({ data } ) => {
        const result: LoginResponse = data.login;
        if (!result.id) {
          const { access_token } = result;
          const now = new Date();
          now.setSeconds(7200);
          this.authService
            .setSessionData({
              user_id: null,
              user_email: null,
              access_token,
              expires_date: now.getTime().toString(),
              is_two_factor_auth_enabled: false,
            })
            .subscribe(() => {
              this.displaying_two_factor_auth_modal = true;
            });
        } else {
          this.effectuateLogin(result);
        }
      },
      (err) => {
        Swal.fire('Error', err, 'error');
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
    const { id, email, access_token } = result;
    const now = new Date();
    now.setSeconds(7200);
    this.authService
      .setSessionData({
        user_id: id,
        user_email: email,
        access_token,
        expires_date: now.getTime().toString(),
        is_two_factor_auth_enabled: false,
      })
      .subscribe(() => {
        this.router.navigate([feed_routing_paths.feed]);
      });
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid && this.formSubmitted;
  }
}
