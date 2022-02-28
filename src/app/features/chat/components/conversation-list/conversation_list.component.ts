import { Component, Input } from '@angular/core'
import { Conversation } from '../../types/conversation'
import { SelectedConversationPresenter } from '../../types/selected_conversation.presenter'
import { MessageCollectionPresenter } from '../../types/message_collection.presenter'
import { MessagePresenter } from '../../types/message.presenter'
import { ConversationMemberPresenter } from '../../types/conversation_member.presenter'
import { ConversationService } from '../../services/conversation.service'
import { FollowService } from '../../../../services/follow.service'
import { ChatService } from '../../services/chat.service'
import * as moment from 'moment';
import { Store } from '@ngxs/store'
import { SetSelectedConversation } from '../../../../shared/state/conversations/selected_conversation.actions'

@Component({
  selector: 'skl-conversation-list',
  templateUrl: './conversation_list.component.html',
  styleUrls: ['./conversation_list.component.css']
})
export class ConversationListComponent {
  public selected_conversation: SelectedConversationPresenter;

  @Input('private-conversations')
  public private_conversations: Map<string, Conversation>;

  @Input('group-conversations')
  public group_conversations: Map<string, Conversation>;

  public related_users_not_in_conversation: Array<ConversationMemberPresenter> = [];

  public constructor(
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowService,
    private readonly chat_service: ChatService,
    private readonly store: Store
  ) {
  }

  public selectConversation(conversation: Conversation) {
    if (this.selected_conversation)
      if (conversation.conversation_id !== this.selected_conversation.conversation_id)
        this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
    this.setSelectedConversation(conversation);
  }

  private setSelectedConversation(conversation: Conversation) {
    const { conversation_id, conversation_members, conversation_name, is_private } = conversation;
    this.selected_conversation = {
      conversation_id,
      conversation_members,
      conversation_name,
      messages: [],
      is_private
    };
    this.setRelatedUsersNotInConversation();
    this.conversation_service.getMessages(this.selected_conversation.conversation_id)
      .subscribe((message_collection: MessageCollectionPresenter) => {
          this.selected_conversation.messages = message_collection.messages
            .sort(
              (first_message: MessagePresenter, second_message: MessagePresenter) => {
                const first_message_date = moment(first_message.created_at, 'YYYY/MM/DD HH:mm:ss');
                const second_message_date = moment(second_message.created_at, 'YYYY/MM/DD HH:mm:ss');
                return first_message_date > second_message_date ? 1 : -1;
              }
            );
          this.chat_service.joinConversation(this.selected_conversation.conversation_id);
          this.store.dispatch(new SetSelectedConversation(this.selected_conversation));
        }
      );
  }

  private setRelatedUsersNotInConversation() {
    this.related_users_not_in_conversation = this.follow_service
      .getFollowingUsers()
      .concat(this.follow_service.getFollowers())
      .map((user) =>
        ({
          member_id: user.user_id,
          member_name: user.name
        })
      )
      .filter((user) => {
          for (const member of this.selected_conversation.conversation_members)
            if (member.member_id === user.member_id)
              return false;
          return true;
        }
      );
  }

  public getPrivateConversationName(conversation_id: string): string {
    for (const member of this.private_conversations.get(conversation_id).conversation_members) {
      if (member.member_id !== this.conversation_service.getUserId()) {
        return member.member_name;
      }
    }
    return '';
  }
}
