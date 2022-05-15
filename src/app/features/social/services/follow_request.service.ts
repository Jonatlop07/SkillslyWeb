import { Injectable } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { Conversation } from '../../chat/types/conversation'
import { forkJoin, Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { FollowingUsersState } from '../../../shared/state/following_users/following_users.state'
import { FollowersState } from '../../../shared/state/followers/followers.state'
import { FollowersModel } from '../model/followers.model'
import { JwtService } from '../../../core/service/jwt.service'
import { SearchUserResponse } from '../types/search_users_response.interface'
import { User } from '../../user-account/types/user.interface'
import { UserFollowCollectionPresenter } from '../types/user_follow_collection.presenter'
import { StoreFollowingUsers } from '../../../shared/state/following_users/following_users.actions'
import { FollowingUsersModel } from '../model/following_users.model'
import { StoreFollowers } from '../../../shared/state/followers/followers.actions'
import { AppendPrivateConversation } from '../../../shared/state/conversations/conversations.actions'
import { environment } from '../../../../environments/environment'
import {Apollo, gql, MutationResult} from "apollo-angular";
import {ApolloQueryResult} from "@apollo/client";

@Injectable()
export class FollowRequestService {
  @Select(FollowingUsersState) following_users$: Observable<FollowingUsersModel>;
  @Select(FollowersState) followers$: Observable<FollowersModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly apollo: Apollo,
    private readonly store: Store
  ) {
  }

  // public getUserFollowCollection(): Observable<UserFollowCollectionPresenter> {
  //   return this.http.get<UserFollowCollectionPresenter>(
  //     `${this.API_URL}/users/follow`,
  //     this.jtw_service.getHttpOptions()
  //   );
  // }
  public getUserFollowCollection(): Observable<ApolloQueryResult<any>> {
    const QUERY_RELATIONSHIPS = gql`
      query followRelationships($user_id: ID!) {
        followRelationships(user_id: $user_id) {
          followers {
            id
            name
            email
          }
          following_users {
            id
            name
            email
          }
          pending_followers {
            id
            name
            email
          }
          pending_users_to_follow {
            id
            name
            email
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: QUERY_RELATIONSHIPS,
      variables: {
        user_id: this.jwt_service.getUserId()
      }
    }).valueChanges;
  }

  public getAndStoreUserFollowCollection(): void {
    this.http.get<UserFollowCollectionPresenter>(
      `${this.API_URL}/users/follow`,
      this.jwt_service.getHttpOptions()
    )
    .subscribe((user_follow_collection: UserFollowCollectionPresenter) => {
      forkJoin(
        {
          store_following_users: this.storeFollowingUsers(user_follow_collection.following_users),
          store_followers: this.storeFollowers(user_follow_collection.followers)
        }
      ).subscribe();
    })
  }

  // public createUserFollowRequest(user: SearchUserResponse) {
  //   return this.http.post(
  //     `${this.API_URL}/users/follow/${user.id}`,
  //     {},
  //     this.jtw_service.getHttpOptions()
  //   )
  // }
  public createUserFollowRequest(user: SearchUserResponse){
    const CREATE_RELATIONSHIP = gql`
      mutation createFollowRequest($user_id: ID!, $user_to_follow_id: ID!) {
        createFollowRequest(user_id: $user_id, user_to_follow_id: $user_to_follow_id) {
          name
          email
        }
      }
    `;
    return this.apollo.mutate({
      mutation: CREATE_RELATIONSHIP,
      variables: {
        user_id: this.jwt_service.getUserId(),
        user_to_follow_id: user.id
      }
    });
  }

  // public deleteUserFollowRequest(user: SearchUserResponse, isRequest: boolean) {
  //   let params = new HttpParams();
  //   params = params.append('isRequest', isRequest.toString());
  //   return this.http.delete(
  //     `${this.API_URL}/users/follow/${user.id}`,
  //     {
  //       params,
  //       ...this.jtw_service.getHttpOptions()
  //     }
  //   )
  // }

  public deleteUserFollowRequest(user: SearchUserResponse, isRequest: boolean) {
    const DELETE_RELATIONSHIP = gql`
      mutation deleteFollowRequest($user_id: ID!, $user_to_follow_id: ID! ,$is_follow_request: Boolean!) {
        deleteFollowRequest(user_id: $user_id, user_to_follow_id: $user_to_follow_id, is_follow_request: $is_follow_request) {
          name
          email
        }
      }
    `;
    return this.apollo.mutate({
      mutation: DELETE_RELATIONSHIP,
      variables: {
        user_id: this.jwt_service.getUserId(),
        user_to_follow_id: user.id,
        is_follow_request: isRequest,
      }
    });
  }

  // public updateFollowRequest(user: SearchUserResponse, accept: boolean): Observable<Conversation> {
  //   return this.http.put<Conversation>(
  //     `${this.API_URL}/users/follow/${user.id}`,
  //     {
  //       accept
  //     },
  //     this.jtw_service.getHttpOptions()
  //   )
  // }

  public updateFollowRequest(user: SearchUserResponse, accept_input: boolean) {
    console.log(user);
    const UPDATE_RELATIONSHIP = gql`
      mutation updateFollowRequest($user_id: ID!, $user_that_requests_id: ID!, $accept: Boolean!) {
        updateFollowRequest(user_id: $user_id, user_that_requests_id: $user_that_requests_id, accept: $accept) {
          name
          email
        }
      }
    `;
    return this.apollo.mutate({
      mutation: UPDATE_RELATIONSHIP,
      variables: {
        user_id: this.jwt_service.getUserId(),
        user_that_requests_id: user.id,
        accept: accept_input,
      }
    });
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

  public appendPrivateConversation(new_conversation: Conversation): Observable<void> {
    return this.store.dispatch(new AppendPrivateConversation(new_conversation));
  }

  private storeFollowingUsers(following_users: Array<User>): Observable<void> {
    return this.store.dispatch(new StoreFollowingUsers(following_users))
  }

  private storeFollowers(followers: Array<User>): Observable<void> {
    return this.store.dispatch(new StoreFollowers(followers));
  }
}
