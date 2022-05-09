import { NgModule } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterView } from './views/register/register.view'
import { LoginView } from './views/login/login.view'
import { PasswordRecoveryView } from './views/password-recovery/password_recovery.view'
import { ResetPasswordView } from './views/reset-password/reset_password.view'
import { RecaptchaModule } from 'ng-recaptcha'
import { AuthRoutingModule } from './auth.routing'
import { SharedModule } from '../../shared/shared.module'
import { DialogModule } from 'primeng/dialog'
import { CalendarModule } from 'primeng/calendar'
import { ReactiveFormsModule } from '@angular/forms'
import { ImageModule } from 'primeng/image'

@NgModule({
  declarations: [
    RegisterView,
    LoginView,
    PasswordRecoveryView,
    ResetPasswordView,
  ],
  imports: [
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CalendarModule,
    PasswordModule,
    ImageModule,
    DividerModule,
    MessageModule,
    DialogModule,
    CheckboxModule,
    RecaptchaModule,
  ],
  providers: []
})
export class AuthModule {}
