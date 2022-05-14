import { Component, OnInit } from '@angular/core'
import { SearchUserResponse } from '../../types/search_users_response.interface'
import { Conversation } from '../../../chat/types/conversation'
import { FollowRequestService } from '../../services/follow_request.service'

@Component({
  selector: 'skl-follow-requests-view',
  templateUrl: './follow_requests.view.html',
  styleUrls: ['./follow_requests.view.css']
})
export class FollowRequestsView  implements OnInit {
  public pendingSentUsers: SearchUserResponse[];

  constructor(
    private readonly followService: FollowRequestService
  ) { }

  ngOnInit(): void {
    const followServiceResponse = this.followService.getUserFollowCollection();
    followServiceResponse.subscribe((resp: any) => {
      this.pendingSentUsers = resp.data.followRelationships.pending_followers;
    })
  }

  public acceptFollowRequest(user: SearchUserResponse, index: number) : void {
    const followServiceResponse = this.followService.updateFollowRequest(user, true);
    followServiceResponse.subscribe(() => {
      this.pendingSentUsers.splice(index, 1);
      // this.followService.appendPrivateConversation(new_conversation);
    })
  }

  public rejectFollowRequest(user: SearchUserResponse, index: number) : void {
    const followServiceResponse = this.followService.updateFollowRequest(user, false);
    followServiceResponse.subscribe(() => {
      this.pendingSentUsers.splice(index, 1);
    })
  }
}
