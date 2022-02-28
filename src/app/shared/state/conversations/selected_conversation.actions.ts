import { SelectedConversationPresenter } from '../../../features/chat/types/selected_conversation.presenter'

export class SetSelectedConversation {
  static readonly type = '[Chat] Set Selected Conversation';

  constructor(public readonly conversation: SelectedConversationPresenter) {
  }
}

export class DeleteSelectedConversation {
  static readonly type = '[Chat] Delete Selected Conversation';

  constructor() {}
}

export class EditSelectedConversationDetails {
  static readonly type = '[Chat] Edit Selected Conversation Details';

  constructor(public conversation_name: string) {
  }
}
