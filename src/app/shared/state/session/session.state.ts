import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { SessionModel } from '../../../models/session.model'
import {
  SetSessionData, SetTwoFactorAuthentication, UpdateSessionEmail
} from './session.actions'
import { Injectable } from '@angular/core'

const SESSION_STATE_TOKEN = new StateToken<SessionModel>('session');

@Injectable({
  providedIn: 'root'
})
@State<SessionModel>({
  name: SESSION_STATE_TOKEN
})
export class SessionState {
  @Action(SetSessionData)
  public setSessionData(ctx: StateContext<SessionModel>, action: SetSessionData) {
    ctx.setState({
      ...action.session_data
    });
  }

  @Action(UpdateSessionEmail)
  public updateSessionEmail(ctx: StateContext<SessionModel>, action: UpdateSessionEmail) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      user_email: action.email
    });
  }

  @Action(SetTwoFactorAuthentication)
  public setTwoFactorAuthentication(ctx: StateContext<SessionModel>, action: SetTwoFactorAuthentication) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      is_two_factor_auth_enabled: action.is_two_factor_auth_enabled
    });
  }
}
