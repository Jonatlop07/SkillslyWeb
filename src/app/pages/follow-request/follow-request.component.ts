import { Component, OnInit } from '@angular/core';
import { SearchUserResponse } from 'src/app/interfaces/search_users_response.interface';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-follow-request',
  templateUrl: './follow-request.component.html',
  styleUrls: ['./follow-request.component.css']
})
export class FollowRequestComponent implements OnInit {

  public pendingSentUsers: SearchUserResponse[];
  
  constructor(
    private followService: FollowService
  ) { }

  ngOnInit(): void {
    const followServiceResponse = this.followService.getFollowRequests(); 
    followServiceResponse.subscribe((resp:any) => {
      this.pendingSentUsers = resp.pendingSentUsers; 
    })
  }

  acceptFollowRequest(user:SearchUserResponse, index: number) : void {
    const followServiceResponse = this.followService.updateFollowRequest(user,true);
    followServiceResponse.subscribe((resp:any) => {
      this.pendingSentUsers.splice(index,1); 
    })
  }

  rejectFollowRequest(user:SearchUserResponse, index: number) : void {
    const followServiceResponse = this.followService.updateFollowRequest(user,false);
    followServiceResponse.subscribe((resp:any) => {
      this.pendingSentUsers.splice(index,1); 
    })
  }

}
