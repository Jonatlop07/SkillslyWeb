import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter';
import { GroupConversationDetailsPresenter } from '../../../interfaces/presenter/chat/group_conversation_details.presenter'

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

export class EditGroupConversationDetails {
  static readonly type = '[Chat] Edit Group Conversation Details';

  constructor(
    public readonly conversation_id: string,
    public readonly conversation_details: GroupConversationDetailsPresenter
  ) {
  }
}

export class DeleteGroupConversation {
  static readonly type = '[Chat] Delete Group Conversation';

  constructor(public readonly conversation_id: string) {
  }
}
