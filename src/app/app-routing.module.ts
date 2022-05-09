import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './no-page-found/nopagefound.component'
import { PagesRoutingModule } from './pages/pages.routing'
import { AuthRoutingModule, routing_paths as auth_routing_paths } from './features/authentication/auth.routing'

const routes: Routes = [
  { path: '', redirectTo: auth_routing_paths.sign_in, pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
    AuthRoutingModule,
    PagesRoutingModule
  ]
})
export class AppRoutingModule {}
