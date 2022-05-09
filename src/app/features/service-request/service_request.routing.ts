import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ServiceRequestsView } from './views/service-requests/service_requests.view'

export const routing_paths = {
  service_requests: 'service-requests'
};

const routes: Routes = [
  {
    path: routing_paths.service_requests,
    component: ServiceRequestsView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestRoutingModule {}
