import { ConversationPresenter } from '../interfaces/presenter/chat/conversation.presenter'

export interface ConversationsModel {
  private_conversations: Array<ConversationPresenter>;
  group_conversations: Array<ConversationPresenter>;
}
