import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component'
import { ResetPasswordComponent } from './components/reset-password/reset-password.component'

export const routing_paths = {
  sign_up: 'sign-up',
  sign_in: 'sign-in',
  password_recovery: 'password-recovery',
  password_reset: 'password-reset/:token'
};

const routes: Routes = [
  { path: routing_paths.sign_up, component: RegisterComponent },
  { path: routing_paths.sign_in, component: LoginComponent },
  { path: routing_paths.password_recovery, component: PasswordRecoveryComponent },
  { path: routing_paths.password_reset, component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AuthRoutingModule {}
