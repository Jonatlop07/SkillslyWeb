import { ConversationMemberPresenter } from 'src/app/features/chat/types/conversation_member.presenter';
import { Conversation } from '../../../features/chat/types/conversation';
import { GroupConversationDetails } from '../../../features/chat/types/group_conversation_details'

export class AppendPrivateConversation {
  static readonly type = '[Follow Request] Append Private Conversation';

  constructor(public readonly conversation: Conversation) {}
}

export class AppendGroupConversation {
  static readonly type = '[Chat] Append Group Conversation';

  constructor(public readonly conversation: Conversation) {}
}

export class StoreConversations {
  static readonly type = '[Auth] Store Private and Group Conversations';

  constructor(
    public readonly private_conversations: Array<Conversation>,
    public readonly group_conversations: Array<Conversation>
  ) {}
}

export class EditGroupConversationDetails {
  static readonly type = '[Chat] Edit Group Conversation Details';

  constructor(
    public readonly conversation_id: string,
    public readonly conversation_details: GroupConversationDetails
  ) {
  }
}

export class DeleteGroupConversation {
  static readonly type = '[Chat] Delete Group Conversation';

  constructor(public readonly conversation_id: string) {
  }
}

export class AddMembersToGroupConversation {
  static readonly type = '[Chat] Add Members to Group Conversation';

  constructor(
    public readonly conversation_id: string,
    public readonly members_to_add: Array<ConversationMemberPresenter>
  ) {}
}
