import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { FollowingUsersModel } from 'src/app/models/following_users.model';
import { AppendFollowingUser, StoreFollowingUsers } from './following_users.actions'
import { Injectable } from '@angular/core'

const FOLLOWING_USERS_STATE_TOKEN = new StateToken<FollowingUsersModel>('following_users');

@Injectable({
  providedIn: 'root'
})
@State({
  name: FOLLOWING_USERS_STATE_TOKEN,
  defaults: {
    users: []
  }
})
export class FollowingUsersState {
  @Action(StoreFollowingUsers)
  public storeFollowingUsers(ctx: StateContext<FollowingUsersModel>, action: StoreFollowingUsers) {
    ctx.setState({
      users: action.following_users
    })
  }

  @Action(AppendFollowingUser)
  public appendFollowingUser(ctx: StateContext<FollowingUsersModel>, action: AppendFollowingUser) {
    const state = ctx.getState();
    ctx.setState({
      users: [
        ...state.users,
        action.following_user
      ]
    })
  }
}
