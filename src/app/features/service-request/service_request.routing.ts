import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {CreateServiceRequestView} from './views/create-service-request/create_service_request.view'

export const routing_paths = {
  service_request: 'service-request',
  create_service_request: 'create'
};

const routes: Routes = [
  {
    path: routing_paths.create_service_request,
    component: CreateServiceRequestView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ServiceRequestRoutingModule {}
