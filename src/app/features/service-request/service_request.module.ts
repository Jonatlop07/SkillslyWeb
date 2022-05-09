import { NgModule } from '@angular/core'
import { ServiceRequestsView } from './views/service-requests/service_requests.view'
import { ServiceRequestComponent } from './components/service-request/service_request.component'
import { ServiceRequestsService } from './services/service_requests.service'
import { UserAccountModule } from '../user-account/user_account.module'
import { ServiceRequestRoutingModule } from './service_request.routing'
import { DialogModule } from 'primeng/dialog'
import { ChipsModule } from 'primeng/chips'
import { RippleModule } from 'primeng/ripple'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    ServiceRequestComponent,
    ServiceRequestsView,
  ],
  imports: [
    SharedModule,
    DialogModule,
    RippleModule,
    ChipsModule,
    UserAccountModule,
    ServiceRequestRoutingModule,
  ],
  providers: [
    ServiceRequestsService
  ]
})
export class ServiceRequestModule {}
