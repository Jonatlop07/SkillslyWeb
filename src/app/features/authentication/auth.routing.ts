import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterView } from './views/register/register.view'
import { LoginView } from './views/login/login.view'
import { PasswordRecoveryView } from './views/password-recovery/password_recovery.view'
import { ResetPasswordView } from './views/reset-password/reset_password.view'

export const auth_routing_paths = {
  auth: 'auth',
  sign_up: 'sign-up',
  sign_in: 'sign-in',
  password_recovery: 'password-recovery',
  password_reset: 'password-reset/:token'
};

const routes: Routes = [
  { path: auth_routing_paths.sign_up, component: RegisterView },
  { path: auth_routing_paths.sign_in, component: LoginView },
  { path: auth_routing_paths.password_recovery, component: PasswordRecoveryView },
  { path: auth_routing_paths.password_reset, component: ResetPasswordView },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
