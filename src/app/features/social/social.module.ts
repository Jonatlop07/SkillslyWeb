import { NgModule } from '@angular/core'
import { FollowRequestsView } from './views/follow-requests/follow_requests.view'
import { CommonModule } from '@angular/common'
import { SearchView } from './views/search/search.view'
import { ButtonModule } from 'primeng/button'
import { FollowRequestService } from './services/follow_request.service'
import { SearchService } from './services/search.service'
import { SocialRoutingModule } from './social.routing'

@NgModule({
  declarations: [
    FollowRequestsView,
    SearchView
  ],
  imports: [
    CommonModule,
    ButtonModule,

    SocialRoutingModule
  ],
  providers: [
    FollowRequestService,
    SearchService
  ]
})
export class SocialModule {}
