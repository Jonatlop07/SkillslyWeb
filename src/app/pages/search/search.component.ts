import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchUserResponse } from '../../interfaces/search_users_response.interface';
import * as moment from 'moment';
import { SearchUserInputForm } from 'src/app/interfaces/search_users_input_form.interface';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchInput: string;
  public foundUsers: SearchUserResponse[];
  public pendingUsers: SearchUserResponse[];
  public followingUsers: SearchUserResponse[];
  public isPending: boolean[];
  public isFollowing: boolean[];
  public sameUser: boolean[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private searchService: SearchService,
    private followService: FollowService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.searchInput = params.searchInput;
      const searchUserForm: SearchUserInputForm = {
        email: this.searchInput,
        name: this.searchInput
      };
      const searchServiceResponse = this.searchService.searchUser(searchUserForm);
      searchServiceResponse.subscribe( (resp: any) => {
        this.foundUsers = resp.users;
        this.isFollowing = new Array(this.foundUsers.length).fill(false);
        this.isPending = new Array(this.foundUsers.length).fill(false);
        this.sameUser = new Array(this.foundUsers.length).fill(false);
        this.foundUsers.forEach( (user: any) => {
          const date_of_birth = new Date(user.date_of_birth);
          user.date_of_birth = moment(date_of_birth).locale('es').format('dddd DD MMMM - YYYY')
        });
        const followServiceResponse = this.followService.getUserFollowCollection();
        followServiceResponse.subscribe( (resp:any) => {
          this.pendingUsers = resp.pendingUsers;
          this.followingUsers = resp.followingUsers;
          for (let i = 0; i<this.foundUsers.length; i++) {
            let foundUser: SearchUserResponse = this.foundUsers[i];
            if (foundUser.user_id == this.searchService.getUserId()) {
              this.sameUser[i] = true;
            }
            if (this.pendingUsers.filter(e => e.email == foundUser.email).length > 0) {
              this.isPending[i] = true;
            } else if(this.followingUsers.filter(e => e.email == foundUser.email).length > 0) {
              this.isFollowing[i] = true;
            }
          }
        });
      });
    });
  }

  searchPost(userId: string): void {
    this.router.navigate(['../../query', userId], {relativeTo: this.activatedRoute });
  }

  followUser(user: SearchUserResponse, index: number): void {
    const followServiceResponse = this.followService.createUserFollowRequest(user);
    followServiceResponse.subscribe((resp:any) => {
      this.isPending[index] = true;
    })
  }

  cancelFollow(user: SearchUserResponse, index:number, isRequest: boolean): void {
    const followServiceResponse = this.followService.deleteUserFollowRequest(user, isRequest);
    followServiceResponse.subscribe((resp:any) => {
      if (isRequest) {
        this.isPending[index] = false;
      } else {
        this.isFollowing[index] = false;
      }
    })
  }
}

