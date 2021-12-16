import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

import { LoginForm } from '../../interfaces/login_form.inteface';
import { LoginResponse } from '../../interfaces/login_response.interface'
import { ChatService } from '../../services/chat.service';
import { FollowService } from '../../services/follow.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public form: FormGroup;
  public loginForm: LoginForm;
  public formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly chat_service: ChatService,
    private readonly follow_service: FollowService,
    private readonly event_service: EventService,
    private readonly router: Router
  ) {
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
    });
  }

  async saveForm(): Promise<void> {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loginForm = this.form.value;

    this.authService
      .loginUser(this.loginForm)
      .subscribe(
        (result: LoginResponse) => {
          const { id, email, roles, access_token } = result;
          const now = new Date();
          now.setSeconds(7200);
          localStorage.setItem('token', access_token);
          this.authService.setSessionData({
            user_id: id,
            user_email: email,
            user_roles: roles,
            access_token,
            expires_date: now.getTime().toString()
          }).subscribe(() => {
            this.follow_service.getAndStoreUserFollowCollection();
            this.chat_service.getAndStoreConversations();
            this.event_service.getAndStoreMyEventsCollection();
            this.router.navigate(['/main/feed']);
          })
        },
        (err) => {
          Swal.fire('Error', err.error.error, 'error');
        }
      );
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid && this.formSubmitted;
  }
}
