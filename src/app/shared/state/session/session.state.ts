import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { SessionModel } from '../../../models/session.model'
import {
  SetSessionData, UpdateSessionEmail
} from './session.actions'

const SESSION_STATE_TOKEN = new StateToken<SessionModel>('session');

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
    })
  }
}
