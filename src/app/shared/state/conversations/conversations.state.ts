import { ConversationCollectionModel } from 'src/app/features/chat/model/conversation_collection.model'
import { Injectable } from '@angular/core'
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store'
import {
  AddMembersToGroupConversation,
  AppendGroupConversation, AppendPrivateConversation,
  DeleteGroupConversation, EditGroupConversationDetails, StoreConversations
} from './conversations.actions'

const CONVERSATIONS_STATE_TOKEN = new StateToken<ConversationCollectionModel>('my_conversations');

@Injectable({
  providedIn: 'root'
})
@State<ConversationCollectionModel>({
  name: CONVERSATIONS_STATE_TOKEN,
  defaults: {
    private_conversations: [],
    group_conversations: []
  }
})
export class MyConversationsState {

  @Selector()
  static privateConversations(state: ConversationCollectionModel) {
    return state.private_conversations;
  }

  @Selector()
  static groupConversations(state: ConversationCollectionModel) {
    return state.group_conversations;
  }

  @Action(AppendPrivateConversation)
  public appendPrivateConversation(ctx: StateContext<ConversationCollectionModel>, action: AppendPrivateConversation) {
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
  public appendGroupConversation(ctx: StateContext<ConversationCollectionModel>, action: AppendGroupConversation) {
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
  public storeConversations(ctx: StateContext<ConversationCollectionModel>, action: StoreConversations) {
    ctx.setState({
      private_conversations: action.private_conversations,
      group_conversations: action.group_conversations
    })
  }

  @Action(EditGroupConversationDetails)
  public editGroupConversationDetails(ctx: StateContext<ConversationCollectionModel>, action: EditGroupConversationDetails) {
    const state = ctx.getState();
    const group_conversations = [...state.group_conversations];
    for (let i = 0; i < group_conversations.length; ++i) {
      if (group_conversations[i].conversation_id === action.conversation_id) {
        const conversation = group_conversations[i];
        group_conversations[i] = {
          ...conversation,
          conversation_name: action.conversation_details.conversation_name
        };
        break;
      }
    }
    ctx.setState({
      private_conversations: state.private_conversations,
      group_conversations: group_conversations
    })
  }

  @Action(DeleteGroupConversation)
  public deleteGroupConversation(ctx: StateContext<ConversationCollectionModel>, action: DeleteGroupConversation) {
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
  public addMembersToGroupConversation(ctx: StateContext<ConversationCollectionModel>, action: AddMembersToGroupConversation) {
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
