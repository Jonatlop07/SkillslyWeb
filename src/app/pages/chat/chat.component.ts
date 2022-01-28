import { Component, OnDestroy, OnInit } from '@angular/core'
import { Conversation } from '../../interfaces/chat/conversation'
import { ConversationService } from '../../services/conversation.service'
import { SelectedConversationPresenter } from '../../interfaces/chat/selected_conversation.presenter'
import { MessagePresenter } from '../../interfaces/chat/message.presenter'
import { NewConversationDetails } from '../../interfaces/chat/new_conversation_details'
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageCollectionPresenter } from '../../interfaces/chat/message_collection.presenter';
import { ConversationMemberPresenter } from '../../interfaces/chat/conversation_member.presenter';
import { FollowService } from '../../services/follow.service';
import { GroupConversationDetails } from '../../interfaces/chat/group_conversation_details'
import { AddedMembersPresenter } from '../../interfaces/chat/added_members.presenter'
import { ChatService } from '../../services/chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  public moment = moment

  public private_conversations: Map<string, Conversation> = new Map<string, Conversation>();
  public group_conversations: Map<string, Conversation> = new Map<string, Conversation>();
  public selected_conversation: SelectedConversationPresenter;
  public current_message: string = '';

  public is_creating_conversation = false;
  public is_editing_group_conversation_details = false;
  public is_adding_group_conversation_members = false;

  public related_users: Array<ConversationMemberPresenter> = [];
  public related_users_not_in_conversation: Array<ConversationMemberPresenter> = [];

  public new_conversation: NewConversationDetails;
  public new_conversation_name = '';
  public new_conversation_members: Array<ConversationMemberPresenter> = [];

  public edited_conversation_name = '';

  public conversation_members_to_add: Array<ConversationMemberPresenter> = [];

  private unsubscribe_on_destroy = new Subject<void>();

  constructor(
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowService,
    private readonly chat_service: ChatService
  ) {}

  ngOnInit() {
    const { private_conversations, group_conversations } = this.conversation_service.getConversationsFromStore();
    private_conversations.forEach((conversation: Conversation) => {
      this.private_conversations.set(conversation.conversation_id, conversation);
    });
    group_conversations.forEach((conversation: Conversation) => {
      this.group_conversations.set(conversation.conversation_id, conversation);
    });
    if (private_conversations.length > 0) {
      this.setSelectedConversation(this.private_conversations.get(private_conversations[0].conversation_id));
    } else if (group_conversations.length > 0) {
      this.setSelectedConversation(this.group_conversations.get(group_conversations[0].conversation_id))
    }
    this.chat_service
      .onMessageSent()
      .pipe(takeUntil(this.unsubscribe_on_destroy))
      .subscribe((message: MessagePresenter) => {
        this.selected_conversation.messages.push(message);
      });
    this.chat_service
      .onMessageDelete()
      .pipe(takeUntil(this.unsubscribe_on_destroy))
      .subscribe((message: MessagePresenter) => {
        let message_to_delete_index = this.selected_conversation.messages.indexOf(message);
        if (message_to_delete_index > -1) {
          this.selected_conversation.messages.splice(message_to_delete_index, 1);
        }
      });
    this.related_users = this.follow_service
      .getFollowingUsers()
      .concat(this.follow_service.getFollowers())
      .map((user) =>
        ({
          member_id: user.user_id,
          member_name: user.name
        })
      );
  }

  ngOnDestroy() {
    this.unsubscribe_on_destroy.next();
    this.unsubscribe_on_destroy.complete();
    if (this.selected_conversation)
      this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
    this.chat_service.stop();
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

  public selectConversation(conversation: Conversation) {
    if (this.selected_conversation)
      if (conversation.conversation_id !== this.selected_conversation.conversation_id)
        this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
    this.setSelectedConversation(conversation);
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
        this.group_conversations.set(conversation.conversation_id, conversation);
        this.setSelectedConversation(conversation);
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

  public editGroupConversationDetails(conversation_id: string) {
    if (this.edited_conversation_name === '') return;
    this.conversation_service
      .editGroupConversationDetails(conversation_id, { conversation_name: this.edited_conversation_name })
      .subscribe((conversation_details: GroupConversationDetails) => {
        const conversation: Conversation = this.group_conversations.get(conversation_id);
        const edited_conversation: Conversation = {
          ...conversation,
          conversation_name: conversation_details.conversation_name
        };
        this.conversation_service.editGroupConversationDetailsInStore(conversation_id, conversation_details).subscribe();
        this.group_conversations.set(conversation_id, edited_conversation);
        this.selected_conversation.conversation_name = edited_conversation.conversation_name;
    })
    this.toggleEditingGroupConversationDetails();
  }

  public addMembersToExistingConversation() {
    const conversation_id = this.selected_conversation.conversation_id;
    this.conversation_service.addMembersToExistingConversation(
      this.selected_conversation.conversation_id,
      this.conversation_members_to_add.map((member) => member.member_id)
    ).subscribe((response: AddedMembersPresenter) => {
      const added_members: Array<ConversationMemberPresenter> = response.added_members.map(
        (member) =>
          ({
            member_id: member.user_id,
            member_name: member.name
          })
        );
      const conversation: Conversation = this.group_conversations.get(conversation_id);
      const conversation_with_members_added: Conversation = {
        ...conversation,
        conversation_members: conversation.conversation_members.concat(added_members)
      };
      this.conversation_service.addNewMembersToGroupConversationInStore(conversation_id, added_members).subscribe();
      this.group_conversations.set(conversation_id, conversation_with_members_added);
      this.setRelatedUsersNotInConversation();
      this.conversation_members_to_add = [];
      this.toggleAddingGroupConversationMembers();
      this.setSelectedConversation(conversation_with_members_added);
    });
  }

  public exitGroupConversation(conversation_id: string) {
    this.conversation_service
      .exitConversation(conversation_id)
      .subscribe(() => {
        this.removeConversation(conversation_id);
      });
  }

  public deleteGroupConversation(conversation_id: string) {
    this.conversation_service
      .deleteGroupConversation(conversation_id)
      .subscribe(() => {
        this.removeConversation(conversation_id);
      });
  }

  private removeConversation(conversation_id: string) {
    this.group_conversations.delete(conversation_id);
    this.conversation_service.deleteGroupConversationInStore(conversation_id).subscribe();
    this.selected_conversation = null;
  }

  public sendMessage() {
    if (this.current_message !== '') {
      this.chat_service.sendMessage({
        message: this.current_message,
        conversation_id: this.selected_conversation.conversation_id
      });
      this.current_message = '';
    }
  }

  public deleteMessage(message: MessagePresenter) {
    this.chat_service.deleteMessage(message);
  }

  public getUserName(user_id: string): string {
    return this.selected_conversation
      .conversation_members
      .find((conversation_member: ConversationMemberPresenter) => conversation_member.member_id === user_id)
      .member_name;
  }

  public isNotCurrentUser(user_id: string): boolean {
    return user_id !== this.conversation_service.getUserId();
  }

  public toggleCreatingConversation() {
    this.is_creating_conversation = !this.is_creating_conversation;
  }

  public toggleEditingGroupConversationDetails() {
    this.is_editing_group_conversation_details = !this.is_editing_group_conversation_details
  }

  public toggleAddingGroupConversationMembers() {
    this.is_adding_group_conversation_members = !this.is_adding_group_conversation_members;
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

  public removeMemberFromConversation(member: ConversationMemberPresenter) {
    if (this.new_conversation_members.includes(member)) {
      this.related_users.push(member);
      this.new_conversation_members = this.new_conversation_members
        .filter(
          (conversation_member) =>
            conversation_member.member_id !== member.member_id
        );
    }
  }

  public addMemberToExistingConversation(member: ConversationMemberPresenter) {
    if (!this.conversation_members_to_add.includes(member)) {
      this.conversation_members_to_add.push(member);
      this.related_users_not_in_conversation = this.related_users_not_in_conversation
        .filter((related_user) => related_user.member_id !== member.member_id);
    }
  }

  public undoAddingMemberToExistingConversation(member: ConversationMemberPresenter) {
    if (this.conversation_members_to_add.includes(member)) {
      this.related_users_not_in_conversation.push(member);
      this.conversation_members_to_add = this.conversation_members_to_add
        .filter((conversation_member) => conversation_member.member_id !== member.member_id);
    }
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
