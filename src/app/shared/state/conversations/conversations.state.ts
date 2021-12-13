import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { ConversationsModel } from '../../../models/conversations.model'
import {
  AddMembersToGroupConversation,
  AppendGroupConversation,
  AppendPrivateConversation, DeleteGroupConversation,
  EditGroupConversationDetails,
  StoreConversations
} from './conversations.actions'
import { Injectable } from '@angular/core'
import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter'

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

  @Action(EditGroupConversationDetails)
  public editGroupConversationDetails(ctx: StateContext<ConversationsModel>, action: EditGroupConversationDetails) {
    const state = ctx.getState();
    for (let i = 0; i < state.group_conversations.length; ++i) {
      if (state.group_conversations[i].conversation_id === action.conversation_id) {
        const conversation = state.group_conversations[i]
        conversation.conversation_name = action.conversation_details.conversation_name;
        state.group_conversations[i] = conversation;
        break;
      }
    }
    ctx.setState({
      private_conversations: state.private_conversations,
      group_conversations: state.group_conversations
    })
  }

  @Action(DeleteGroupConversation)
  public deleteGroupConversation(ctx: StateContext<ConversationsModel>, action: DeleteGroupConversation) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      group_conversations: state.group_conversations.filter(
        (conversation) =>
          conversation.conversation_id !== action.conversation_id
      )
    })
  }

  @Action(AddMembersToGroupConversation)
  public addMembersToGroupConversation(ctx: StateContext<ConversationsModel>, action: AddMembersToGroupConversation) {
    const state = ctx.getState();
    const group_conversations = [...state.group_conversations];
    for (let i = 0; i < group_conversations.length; ++i) {
      if (group_conversations[i].conversation_id === action.conversation_id) {
        const conversation = group_conversations[i];
        group_conversations[i] = {
          ...conversation,
          conversation_members: conversation.conversation_members.concat(action.members_to_add)
        };
        break;
      }
    }
    ctx.setState({
      private_conversations: state.private_conversations,
      group_conversations
    })
  }
}
