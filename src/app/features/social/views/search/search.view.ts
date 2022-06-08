import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchUserInputForm } from '../../types/search_users_input_form.interface';
import { SearchUserResponse } from '../../types/search_users_response.interface';
import { SearchService } from '../../services/search.service';
import { FollowRequestService } from '../../services/follow_request.service';
import * as moment from 'moment';
import { post_routing_paths } from '../../../post/post.routing';

@Component({
  selector: 'skl-search-view',
  templateUrl: './search.view.html',
  styleUrls: ['./search.view.css'],
})
export class SearchView implements OnInit {
  public searchEmail = '';
  public searchName = '';
  public foundUsers: SearchUserResponse[] = [];
  public pendingUsers: SearchUserResponse[];
  public followingUsers: SearchUserResponse[];
  public isPending: boolean[];
  public isFollowing: boolean[];
  public sameUser: boolean[];
  public limit: number;
  public offset: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private followService: FollowRequestService
  ) {}

  ngOnInit(): void {
    this.limit = 4;
    this.offset = 0;
    this.activatedRoute.params.subscribe((params) => {
      this.searchEmail = params.searchInput;
      this.searchName = params.searchInput;
      const searchUserForm: SearchUserInputForm = {
        email: this.searchEmail,
        name: this.searchName,
      };
      this.queryUsers(searchUserForm, this.limit, this.offset);
    });
  }

  public searchPosts(user_id: string) {
    this.router.navigate([`${post_routing_paths.posts}/user`, user_id], {
      relativeTo: this.activatedRoute,
    });
  }

  public followUser(user: SearchUserResponse, index: number): void {
    const followServiceResponse =
      this.followService.createUserFollowRequest(user);
    followServiceResponse.subscribe(() => {
      this.isPending[index] = true;
    });
  }

  public cancelFollow(
    user: SearchUserResponse,
    index: number,
    isRequest: boolean
  ): void {
    const followServiceResponse = this.followService.deleteUserFollowRequest(
      user,
      isRequest
    );
    followServiceResponse.subscribe(() => {
      if (isRequest) {
        this.isPending[index] = false;
      } else {
        this.isFollowing[index] = false;
      }
    });
  }

  public queryUsers(
    searchParams: SearchUserInputForm,
    limit: number,
    offset: number
  ) {
    this.searchService
      .searchUser(searchParams, { limit, offset })
      .subscribe((resp: any) => {
        this.offset = this.offset + this.limit;
        this.foundUsers.push(...resp.data.users);
        this.isFollowing = new Array(this.foundUsers.length).fill(false);
        this.isPending = new Array(this.foundUsers.length).fill(false);
        this.sameUser = new Array(this.foundUsers.length).fill(false);
        this.foundUsers.map((user: any) => {
          const date_of_birth = new Date(user.date_of_birth);
          const date = moment(date_of_birth)
            .locale('es')
            .format('dddd DD MMMM - YYYY');
          return { ...user, date_of_birth: date };
        });
        const followServiceResponse =
          this.followService.getUserFollowCollection();
        followServiceResponse.subscribe((resp: any) => {
          this.pendingUsers = resp.data.followRelationships.pending_users_to_follow;
          this.followingUsers = resp.data.followRelationships.following_users;
          for (let i = 0; i < this.foundUsers.length; i++) {
            const foundUser: SearchUserResponse = this.foundUsers[i];
            if (foundUser.id == this.searchService.getUserId()) {
              this.sameUser[i] = true;
            }
            if (
              this.pendingUsers.filter((e) => e.email == foundUser.email)
                .length > 0
            ) {
              this.isPending[i] = true;
            } else if (
              this.followingUsers.filter((e) => e.email == foundUser.email)
                .length > 0
            ) {
              this.isFollowing[i] = true;
            }
          }
        });
      });
  }

  @HostListener('window:scroll', ['$event'])
  public onScroll(): void {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1000;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos > max) {
      if (!this.searchService.isChargingUsers) {
        this.queryUsers(
          { email: this.searchEmail, name: this.searchName },
          this.limit,
          this.offset
        );
      }
    }
  }
}
