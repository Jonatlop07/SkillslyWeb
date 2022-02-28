import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountView } from './views/user_account.view';

export const routing_paths = {
  user_account: 'account'
};

const routes: Routes = [
  {
    path: routing_paths.user_account,
    component: UserAccountView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule {}
