import { NgModule } from '@angular/core'
import { FollowRequestsView } from './views/follow-requests/follow_requests.view'
import { SearchView } from './views/search/search.view'
import { FollowRequestService } from './services/follow_request.service'
import { SearchService } from './services/search.service'
import { SocialRoutingModule } from './social.routing'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    FollowRequestsView,
    SearchView
  ],
  imports: [
    SharedModule,
    SocialRoutingModule
  ],
  providers: [
    FollowRequestService,
    SearchService
  ]
})
export class SocialModule {}
