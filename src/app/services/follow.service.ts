import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { SearchUserResponse } from '../interfaces/search_users_response.interface';
import { ConversationPresenter } from '../interfaces/presenter/chat/conversation.presenter';
import { forkJoin, Observable } from 'rxjs'
import { AppendPrivateConversation } from '../shared/state/conversations/conversations.actions'
import { Select, Store } from '@ngxs/store'
import { UserFollowCollectionPresenter } from '../interfaces/presenter/user/user_follow_collection.presenter'
import { User } from '../interfaces/user.interface';
import { StoreFollowers } from '../shared/state/followers/followers.actions';
import { StoreFollowingUsers } from '../shared/state/following_users/following_users.actions';
import { FollowingUsersState } from '../shared/state/following_users/following_users.state';
import { FollowingUsersModel } from '../models/following_users.model';
import { FollowersState } from '../shared/state/followers/followers.state';
import { FollowersModel } from '../models/followers.model';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  @Select(FollowingUsersState) following_users$: Observable<FollowingUsersModel>;
  @Select(FollowersState) followers$: Observable<FollowersModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jtw_service: JwtService,
    private readonly store: Store
  ) {
  }

  public getUserFollowCollection() {
    return this.http.get<UserFollowCollectionPresenter>(
      `${this.API_URL}/users/follow`,
      this.jtw_service.getHttpOptions()
    );
  }

  public getAndStoreUserFollowCollection() {
    this.http.get<UserFollowCollectionPresenter>(
      `${this.API_URL}/users/follow`,
      this.jtw_service.getHttpOptions()
    )
      .subscribe((user_follow_collection: UserFollowCollectionPresenter) => {
      forkJoin(
        {
          store_following_users: this.storeFollowingUsers(user_follow_collection.followingUsers),
          store_followers: this.storeFollowers(user_follow_collection.followers)
        }
      ).subscribe(({}) => {});
    })
  }

  public createUserFollowRequest(user: SearchUserResponse) {
    return this.http.post(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {},
      this.jtw_service.getHttpOptions()
    )
  }

  public deleteUserFollowRequest(user: SearchUserResponse, isRequest: boolean) {
    let params = new HttpParams();
    params = params.append('isRequest', isRequest.toString());
    return this.http.delete(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {
        params,
        ...this.jtw_service.getHttpOptions()
      }
    )
  }

  public updateFollowRequest(user: SearchUserResponse, accept: boolean): Observable<ConversationPresenter> {
    return this.http.put<ConversationPresenter>(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {
        accept
      },
      this.jtw_service.getHttpOptions()
    )
  }

  public getFollowingUsers(): Array<User> {
    let users: Array<User> = [];
    this.following_users$.subscribe(following_users => {
      users = following_users.users;
    });
    return users;
  }

  public getFollowers(): Array<User> {
    let users: Array<User> = [];
    this.followers$.subscribe(followers => {
      users = followers.users;
    });
    return users;
  }

  public appendPrivateConversation(new_conversation: ConversationPresenter): Observable<void> {
    return this.store.dispatch(new AppendPrivateConversation(new_conversation));
  }

  private storeFollowingUsers(following_users: Array<User>): Observable<void> {
    return this.store.dispatch(new StoreFollowingUsers(following_users))
  }

  private storeFollowers(followers: Array<User>): Observable<void> {
    return this.store.dispatch(new StoreFollowers(followers));
  }
}
