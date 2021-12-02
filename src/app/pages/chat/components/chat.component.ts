import { Component, OnDestroy, OnInit } from '@angular/core'
import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter'
import { ChatService } from '../../../services/chat.service'
import { SelectedConversationPresenter } from '../../../interfaces/presenter/chat/selected_conversation.presenter'
import { MessagePresenter } from '../../../interfaces/presenter/chat/message.presenter'
import { NewConversationPresenter } from '../../../interfaces/presenter/chat/new_conversation.presenter'
import * as moment from 'moment';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ConversationsPresenter } from '../../../interfaces/presenter/chat/conversations.presenter'
import { MessageCollectionPresenter } from '../../../interfaces/presenter/chat/message_collection.presenter'
import { ConversationMemberPresenter } from '../../../interfaces/presenter/chat/conversation_member.presenter'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  moment = moment
  create_conversation_form: FormGroup;

  conversations: Map<string, ConversationPresenter> = new Map<string, ConversationPresenter>();
  selected_conversation: SelectedConversationPresenter;
  current_message: string = '';

  new_conversation: NewConversationPresenter;
  new_conversation_members: Array<string> = []
  member_option: string;

  is_creating_conversation = false;

  private unsubscribe_on_destroy = new Subject<void>();

  constructor(
    private readonly form_builder: FormBuilder,
    private readonly chat_service: ChatService
  ) {
  }

  ngOnInit() {
    this.chat_service
      .getConversations()
      .subscribe((response: ConversationsPresenter) => {
        response.conversations.forEach((conversation: ConversationPresenter) => {
          this.conversations.set(conversation.conversation_id, conversation);
        });
        this.setSelectedConversation(this.conversations.get(response.conversations[0].conversation_id));
      });
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
    this.initCreateConversationForm();
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
    this.new_conversation = this.create_conversation_form.value;
    if (this.isInvalidCreateConversationForm()) {
      return;
    }
    this.chat_service
      .createConversation(this.new_conversation)
      .subscribe((conversation: ConversationPresenter) => {
        this.conversations.set(conversation.conversation_id, conversation);
      });
  }

  public deleteConversation(conversation_id: string) {
    this.chat_service
      .deleteConversation(
        conversation_id
      ).subscribe((res) => {
      this.conversations.delete(conversation_id);
      this.selected_conversation = null;
    })
  }

  public exitConversation(conversation_id: string) {
    this.chat_service
      .exitConversation(conversation_id)
      .subscribe((res) => {
        this.conversations.delete(conversation_id);
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
    return user_id !== localStorage.getItem('id');
  }

  public toggleCreatingConversation() {
    this.is_creating_conversation = !this.is_creating_conversation;
  }

  public initCreateConversationForm() {
    this.create_conversation_form = this.form_builder.group({
      conversation_name: ['', [Validators.required]],
    });
  }

  private isInvalidCreateConversationForm() {
    return this.create_conversation_form.invalid;
  }

  public addMemberToNewConversation(member: string) {
    this.new_conversation_members.push(member);
  }
}
