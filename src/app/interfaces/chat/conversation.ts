import { ConversationMemberPresenter } from './conversation_member.presenter'

export interface Conversation {
  conversation_id: string;
  conversation_members: Array<ConversationMemberPresenter>;
  conversation_name?: string;
  is_private: boolean;
}
