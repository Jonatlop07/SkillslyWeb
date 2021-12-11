import { Component, OnDestroy, OnInit } from '@angular/core'
import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter'
import { ChatService } from '../../../services/chat.service'
import { SelectedConversationPresenter } from '../../../interfaces/presenter/chat/selected_conversation.presenter'
import { MessagePresenter } from '../../../interfaces/presenter/chat/message.presenter'
import { NewConversationPresenter } from '../../../interfaces/presenter/chat/new_conversation.presenter'
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MessageCollectionPresenter } from '../../../interfaces/presenter/chat/message_collection.presenter';
import { ConversationMemberPresenter } from '../../../interfaces/presenter/chat/conversation_member.presenter';
import { User } from 'src/app/interfaces/user.interface';
import { FollowService } from '../../../services/follow.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  moment = moment

  private_conversations: Map<string, ConversationPresenter> = new Map<string, ConversationPresenter>();
  group_conversations: Map<string, ConversationPresenter> = new Map<string, ConversationPresenter>();
  selected_conversation: SelectedConversationPresenter;
  current_message: string = '';

  related_users: Array<User> = [];

  new_conversation: NewConversationPresenter;
  new_conversation_name = '';
  new_conversation_members: Array<User> = [];

  is_creating_conversation = false;

  private unsubscribe_on_destroy = new Subject<void>();

  constructor(
    private readonly chat_service: ChatService,
    private readonly follow_service: FollowService
  ) {
  }

  ngOnInit() {
    const { private_conversations, group_conversations } = this.chat_service.getConversationsFromStore();
    private_conversations.forEach((conversation: ConversationPresenter) => {
      this.private_conversations.set(conversation.conversation_id, conversation);
    });
    group_conversations.forEach((conversation: ConversationPresenter) => {
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
    this.related_users = this.follow_service.getFollowingUsers().concat(this.follow_service.getFollowers());
  }

  ngOnDestroy() {
    this.unsubscribe_on_destroy.next();
    this.unsubscribe_on_destroy.complete();
    this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
    this.chat_service.stop();
  }

  private setSelectedConversation(conversation: ConversationPresenter) {
    const { conversation_id, conversation_members, conversation_name } = conversation;
    this.selected_conversation = {
      conversation_id,
      conversation_members,
      conversation_name,
      messages: []
    };
    this.chat_service.getMessages(this.selected_conversation.conversation_id)
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

  public selectConversation(conversation: ConversationPresenter) {
    if (conversation.conversation_id !== this.selected_conversation.conversation_id) {
      this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
      this.setSelectedConversation(conversation);
    }
  }

  public createConversation() {
    console.log(this.new_conversation_name);
    if (this.new_conversation_name === '') return;
    console.log('hola?');
    this.new_conversation = {
      conversation_name: this.new_conversation_name,
      conversation_members: this.new_conversation_members.map(member => member.user_id)
    };
    this.chat_service
      .createConversation(this.new_conversation)
      .subscribe((conversation: ConversationPresenter) => {
        this.chat_service.appendGroupConversation(conversation);
        console.log(conversation.conversation_name);
        this.group_conversations.set(conversation.conversation_id, conversation);
      });
  }

  public deleteConversation(conversation_id: string) {
    this.chat_service
      .deleteConversation(
        conversation_id
      ).subscribe((res) => {
      this.group_conversations.delete(conversation_id);
      this.selected_conversation = null;
    })
  }

  public exitConversation(conversation_id: string) {
    this.chat_service
      .exitConversation(conversation_id)
      .subscribe((res) => {
        this.group_conversations.delete(conversation_id);
        this.selected_conversation = null;
      });
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
    return user_id !== this.chat_service.getUserId();
  }

  public toggleCreatingConversation() {
    this.is_creating_conversation = !this.is_creating_conversation;
  }

  public addMemberToNewConversation(member: User) {
    if (!this.new_conversation_members.includes(member)) {
      this.new_conversation_members.push(member);
      this.related_users = this.related_users.filter((related_user) => related_user.user_id !== member.user_id);
    }
  }

  public removeMemberFromConversation(member: User) {
    if (this.new_conversation_members.includes(member)) {
      this.related_users.push(member);
      this.new_conversation_members = this.new_conversation_members.filter((conversation_member) => conversation_member.user_id !== member.user_id);
    }
  }

  public getPrivateConversationName(conversation_id: string): string {
    for (const member of this.private_conversations.get(conversation_id).conversation_members) {
      if (member.member_id !== this.chat_service.getUserId()) {
        return member.member_name;
      }
    }
    return '';
  }
}
