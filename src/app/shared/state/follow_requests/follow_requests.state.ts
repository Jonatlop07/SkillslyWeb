import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { FollowRequestsModel } from 'src/app/models/follow_requests.model';
import { Injectable } from '@angular/core';
import { AppendReceivedFollowRequest, DeleteSentFollowRequest } from './follow_requests.actions';

const FOLLOW_REQUESTS_STATE_TOKEN = new StateToken<FollowRequestsModel>('follow_requests');

@Injectable({
  providedIn: 'root'
})
@State({
  name: FOLLOW_REQUESTS_STATE_TOKEN,
  defaults: {
    received_requests: [],
    sent_requests: []
  }
})
export class FollowRequestsState {

  @Action(AppendReceivedFollowRequest)
  public appendReceivedFollowRequest(ctx: StateContext<FollowRequestsModel>, action: AppendReceivedFollowRequest) {
    const state = ctx.getState();
    ctx.setState({
      received_requests: [...state.received_requests, action.follow_request],
      sent_requests: state.sent_requests
    });
  }

  @Action(DeleteSentFollowRequest)
  public deleteSentFollowRequest(ctx: StateContext<FollowRequestsModel>, action: DeleteSentFollowRequest) {
    const state = ctx.getState();
    ctx.setState({
      received_requests: state.received_requests,
      sent_requests: state.sent_requests.filter((request) => request.user_id !== action.follow_request.id)
    });
  }
}
