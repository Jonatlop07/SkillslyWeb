import {
  DeleteSelectedConversation,
  EditSelectedConversationDetails,
  SetSelectedConversation
} from './selected_conversation.actions'
import { Injectable } from '@angular/core'
import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { ConversationModel } from 'src/app/features/chat/model/conversation.model'

const SELECTED_CONVERSATION_STATE_TOKEN = new StateToken<ConversationModel>('selected_conversation');

@Injectable({
  providedIn: 'root'
})
@State<ConversationModel>({
  name: SELECTED_CONVERSATION_STATE_TOKEN,
  defaults: {
    conversation: null
  }
})
export class SelectedConversationState {
  @Action(SetSelectedConversation)
  public setSelectedConversation(ctx: StateContext<ConversationModel>, action: SetSelectedConversation) {
    ctx.setState({
      conversation: action.conversation
    });
  }

  @Action(DeleteSelectedConversation)
  public deleteSelectedConversation(ctx: StateContext<ConversationModel>, action: DeleteSelectedConversation) {
    ctx.setState({
      conversation: null
    });
  }

  @Action(EditSelectedConversationDetails)
  public editSelectedConversationDetails(ctx: StateContext<ConversationModel>, action: EditSelectedConversationDetails) {
    const selected_conversation = ctx.getState().conversation;
    ctx.setState({
      conversation: {
        ...selected_conversation,
        conversation_name: action.conversation_name
      },
    })
  }
}
