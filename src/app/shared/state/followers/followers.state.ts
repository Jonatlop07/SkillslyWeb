import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { FollowersModel } from 'src/app/models/followers.model';
import { StoreFollowers } from './followers.actions'
import { Injectable } from '@angular/core'

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
