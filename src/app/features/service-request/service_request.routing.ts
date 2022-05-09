import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ServiceRequestsView } from './views/service-requests/service_requests.view'

export const service_request_routing_paths = {
  service_request: 'service-requests'
};

const routes: Routes = [
  {
    path: '',
    component: ServiceRequestsView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class ServiceRequestRoutingModule {}
