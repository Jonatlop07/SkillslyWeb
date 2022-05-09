import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountView } from './views/user_account.view';

export const  user_account_routing_paths = {
  user_account: 'account',
};

const routes: Routes = [
  {
    path: '',
    component: UserAccountView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class UserAccountRoutingModule {}
