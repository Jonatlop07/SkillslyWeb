import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter';

export class AppendPrivateConversation {
  static readonly type = '[Follow Request] Append Private Conversation';

  constructor(public readonly conversation: ConversationPresenter) {}
}

export class AppendGroupConversation {
  static readonly type = '[Chat] Append Group Conversation';

  constructor(public readonly conversation: ConversationPresenter) {}
}

export class StoreConversations {
  static readonly type = '[Auth] Store Private and Group Conversations';

  constructor(
    public readonly private_conversations: Array<ConversationPresenter>,
    public readonly group_conversations: Array<ConversationPresenter>
  ) {}
}
