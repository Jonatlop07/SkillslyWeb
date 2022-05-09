import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { StoreFollowers } from './followers.actions'
import { Injectable } from '@angular/core'
import { FollowersModel } from 'src/app/features/social/model/followers.model'

const FOLLOWERS_STATE_TOKEN = new StateToken<FollowersModel>('followers');

@Injectable({
  providedIn: 'root'
})
@State({
  name: FOLLOWERS_STATE_TOKEN,
  defaults: {
    users: []
  }
})
export class FollowersState {
  @Action(StoreFollowers)
  public storeFollowingUsers(ctx: StateContext<FollowersModel>, action: StoreFollowers) {
    ctx.setState({
      users: action.followers
    })
  }
}
