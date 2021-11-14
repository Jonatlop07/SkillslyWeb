import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';

const routes: Routes = [
  {
    path: 'main',
    component: PagesComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./child_routes.module').then((m) => m.ChildRoutesModule),
  },
  {
    path: 'posts',
    component: PostsCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
