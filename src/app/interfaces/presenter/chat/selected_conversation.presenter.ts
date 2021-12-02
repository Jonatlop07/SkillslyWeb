import { MessagePresenter } from './message.presenter'
import { ConversationMemberPresenter } from './conversation_member.presenter'

export interface SelectedConversationPresenter {
  conversation_id: string;
  conversation_members: Array<ConversationMemberPresenter>;
  conversation_name?: string;
  messages: Array<MessagePresenter>;
}
