import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LaluView} from "./views/lalu.view";

export const lalu_routing_paths = {
  lalu: 'lalu'
};

const routes: Routes = [
  {
    path: '',
    component: LaluView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaluRoutingModule {}
