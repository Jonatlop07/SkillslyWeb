import { MessagePresenter } from './message.presenter'

export interface SelectedConversationPresenter {
  conversation_id: string;
  conversation_members: Array<string>;
  conversation_name?: string;
  messages: Array<MessagePresenter>;
}
