import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './core/components/no-page-found/nopagefound.component'
import { auth_routing_paths } from './features/authentication/auth.routing'
import { MainPage } from './layout/page/main.page'
import { AuthGuard } from './core/guards/auth.guard'
import { AuthPage } from './layout/auth-page/auth.page'
import { NoAuthGuard } from './core/guards/no_auth.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: `${auth_routing_paths.auth}/${auth_routing_paths.sign_in}`,
    pathMatch: 'full'
  },
  {
    path: auth_routing_paths.auth,
    component: AuthPage,
    canActivate: [NoAuthGuard],
    loadChildren: () => import('src/app/features/authentication/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: '',
    component: MainPage,
    canActivate: [AuthGuard],
    loadChildren: () => import('src/app/child_routes.module')
      .then(m => m.ChildRoutesModule)
  },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
