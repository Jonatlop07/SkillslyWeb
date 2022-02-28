import { Component } from '@angular/core'
import { ConversationMemberPresenter } from '../../types/conversation_member.presenter'
import { NewConversationDetails } from '../../types/new_conversation_details'
import { Conversation } from '../../types/conversation'
import { ConversationService } from '../../services/conversation.service'
import { FollowService } from '../../../../services/follow.service'

@Component({
  selector: 'skl-new-conversation',
  templateUrl: './new_conversation.component.html',
  styleUrls: ['./new_conversation.component.css']
})
export class NewConversationComponent {
  public is_creating_conversation = false;

  public new_conversation_name = '';
  public related_users: Array<ConversationMemberPresenter> = [];
  public new_conversation: NewConversationDetails;
  public new_conversation_members: Array<ConversationMemberPresenter> = [];

  public constructor(
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowService
  ) {
  }

  public toggleCreatingConversation() {
    this.is_creating_conversation = !this.is_creating_conversation;
  }

  public addMemberToNewConversation(member: ConversationMemberPresenter) {
    if (!this.new_conversation_members.includes(member)) {
      this.new_conversation_members.push(member);
      this.related_users = this.related_users.filter(
        (related_user) =>
          related_user.member_id !== member.member_id
      );
    }
  }

  public removeMemberFromNewConversation(member: ConversationMemberPresenter) {
    if (this.new_conversation_members.includes(member)) {
      this.related_users.push(member);
      this.new_conversation_members = this.new_conversation_members
        .filter(
          (conversation_member) =>
            conversation_member.member_id !== member.member_id
        );
    }
  }

  public createConversation() {
    if (this.new_conversation_name === '') return;
    this.new_conversation = {
      conversation_name: this.new_conversation_name,
      conversation_members: this.new_conversation_members.map(member => member.member_id)
    };
    this.conversation_service
      .createConversation(this.new_conversation)
      .subscribe((conversation: Conversation) => {
        this.conversation_service.appendGroupConversation(conversation);
        this.toggleCreatingConversation();
        this.new_conversation_name = '';
        this.new_conversation_members = [];
        this.related_users = this.follow_service
          .getFollowingUsers()
          .concat(this.follow_service.getFollowers())
          .map((user) =>
            ({
              member_id: user.user_id,
              member_name: user.name
            })
          );
      });
  }
}
