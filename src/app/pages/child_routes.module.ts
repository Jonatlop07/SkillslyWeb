import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'posts', component: PostsCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}
