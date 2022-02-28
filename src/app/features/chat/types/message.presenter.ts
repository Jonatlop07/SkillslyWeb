export interface MessagePresenter {
  message_id: string;
  owner_id: string;
  content: string;
  created_at: string;
  conversation_id: string;
}

export interface SendMessagePresenter {
  conversation_id: string;
  message: string;
}
