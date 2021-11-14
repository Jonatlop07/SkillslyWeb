import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component'
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'search/:searchInput' , component: SearchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {}
