import { NgModule } from '@angular/core'
import { CreateServiceRequestView } from './views/create-service-request/create_service_request.view'
import { ServiceRequestComponent } from './components/service-request/service_request.component'
import { ServiceRequestsService } from './services/service_requests.service'
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { RippleModule } from 'primeng/ripple'
import { CommonModule } from '@angular/common'
import { ChipsModule } from 'primeng/chips'
import { UserAccountModule } from '../user-account/user_account.module'
import { ServiceRequestRoutingModule } from './service_request.routing'

@NgModule({
  declarations: [
    CreateServiceRequestView,
    ServiceRequestComponent
  ],
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    RippleModule,
    CommonModule,
    ChipsModule,
    UserAccountModule,
    ServiceRequestRoutingModule,
  ],
  providers: [
    ServiceRequestsService
  ]
})
export class ServiceRequestModule {}
