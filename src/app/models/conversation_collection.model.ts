import { Conversation } from '../interfaces/chat/conversation'

export interface ConversationCollectionModel {
  private_conversations: Array<Conversation>;
  group_conversations: Array<Conversation>;
}
