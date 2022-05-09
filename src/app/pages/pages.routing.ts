import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'main',
    component: PagesComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./child_routes.module').then((m) => m.ChildRoutesModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class PagesRoutingModule {}
