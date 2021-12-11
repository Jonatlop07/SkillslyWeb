import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { ConversationsModel } from '../../../models/conversations.model'
import { AppendGroupConversation, AppendPrivateConversation, StoreConversations } from './conversations.actions'
import { Injectable } from '@angular/core'

const CONVERSATIONS_STATE_TOKEN = new StateToken<ConversationsModel>('my_conversations');

@Injectable({
  providedIn: 'root'
})
@State<ConversationsModel>({
  name: CONVERSATIONS_STATE_TOKEN,
  defaults: {
    private_conversations: [],
    group_conversations: []
  }
})
export class MyConversationsState {

  @Action(AppendPrivateConversation)
  public appendPrivateConversation(ctx: StateContext<ConversationsModel>, action: AppendPrivateConversation) {
    const state = ctx.getState();
    ctx.setState({
      group_conversations: state.group_conversations,
      private_conversations: [
        ...state.private_conversations,
        action.conversation
      ]
    })
  }

  @Action(AppendGroupConversation)
  public appendGroupConversation(ctx: StateContext<ConversationsModel>, action: AppendGroupConversation) {
    const state = ctx.getState();
    ctx.setState({
      private_conversations: state.private_conversations,
      group_conversations: [
        ...state.group_conversations,
        action.conversation
      ]
    })
  }

  @Action(StoreConversations)
  public storeConversations(ctx: StateContext<ConversationsModel>, action: StoreConversations) {
    ctx.setState({
      private_conversations: action.private_conversations,
      group_conversations: action.group_conversations
    })
  }
}
