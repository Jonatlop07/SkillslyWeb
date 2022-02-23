import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountView } from './views/user_account.view';
import { AuthGuard } from '../../core/guards/auth.guard'

export const routing_paths = {
  user_account: 'account'
};

const routes: Routes = [
  {
    path: routing_paths.user_account,
    component: UserAccountView,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule {}
