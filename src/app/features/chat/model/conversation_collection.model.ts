import { Conversation } from '../types/conversation'

export interface ConversationCollectionModel {
  private_conversations: Array<Conversation>;
  group_conversations: Array<Conversation>;
}
