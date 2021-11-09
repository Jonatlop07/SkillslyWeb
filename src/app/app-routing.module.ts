import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', component:  NopagefoundComponent},
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    preloadingStrategy: PreloadAllModules
  }), 
    AuthRoutingModule,
    PagesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
