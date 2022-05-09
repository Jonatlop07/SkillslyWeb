import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core'
import { Store } from '@ngxs/store'
import { Conversation } from '../../types/conversation'
import { ConversationService } from '../../services/conversation.service'
import {
  DeleteSelectedConversation,
} from '../../../../shared/state/conversations/selected_conversation.actions'
import { ConversationMemberPresenter } from '../../types/conversation_member.presenter'
import * as moment from 'moment';
import { ChatService } from '../../services/chat.service'
import { AddedMembersPresenter } from '../../types/added_members.presenter'
import { SelectedConversationPresenter } from '../../types/selected_conversation.presenter'
import { MessagePresenter } from '../../types/message.presenter'
import { GroupConversationDetails } from '../../types/group_conversation_details'
import { showErrorPopup, showSuccessPopup } from '../../../../shared/pop-up/pop_up.utils'
import { MessageCollectionPresenter } from '../../types/message_collection.presenter'
import { FollowRequestService } from '../../../social/services/follow_request.service'

@Component({
  selector: 'skl-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  public moment = moment

  @Input('selected-conversation')
  public selected_conversation: SelectedConversationPresenter;

  @Input('private-conversations')
  public private_conversations: Map<string, Conversation> = new Map<string, Conversation>();

  @Input('group-conversations')
  public group_conversations: Map<string, Conversation> = new Map<string, Conversation>();

  @Input('related-users')
  public related_users: Map<string, ConversationMemberPresenter> = new Map<string, ConversationMemberPresenter>();

  @ViewChild('chat_messages') chat_messages: ElementRef;

  public is_editing_group_conversation_details = false;
  public is_adding_group_conversation_members = false;
  public current_message: string = '';

  public message_offset = 0;
  public message_limit = 50;

  public edited_conversation_name = '';

  public related_users_not_in_conversation: Map<string, ConversationMemberPresenter>;
  public conversation_members_to_add: Map<string, ConversationMemberPresenter> = new Map<string, ConversationMemberPresenter>();

  public constructor(
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowRequestService,
    private readonly chat_service: ChatService,
    private readonly store: Store
  ) {
  }

  ngOnInit() {
    this.chat_messages.nativeElement.addEventListener('scroll', this.onScroll);
  }

  onScroll() {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) + 1300;
    const max =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    if (pos > max) {
      if (!this.conversation_service.isChargingMessages()) {
        this.conversation_service
          .getMessages(this.selected_conversation.conversation_id, this.message_limit, this.message_offset)
          .subscribe((response: MessageCollectionPresenter) => {
            this.selected_conversation.messages.push(...response.messages);
            this.message_offset = this.message_offset + this.message_limit;
          });
      }
    }
  }

  public toggleEditingGroupConversationDetails() {
    this.is_editing_group_conversation_details = !this.is_editing_group_conversation_details
  }

  public isAddingGroupConversationMembers() {
    this.related_users_not_in_conversation = new Map(
      this.getRelatedUsersNotInConversation()
        .map((user): [string, ConversationMemberPresenter] => [user.member_id, user])
    );
    this.is_adding_group_conversation_members = true;
  }

  public isNotAddingGroupConversationMembers() {
    this.conversation_members_to_add = new Map<string, ConversationMemberPresenter>();
    this.is_adding_group_conversation_members = false;
  }

  public deleteGroupConversation(conversation_id: string) {
    this.conversation_service
      .deleteGroupConversation(conversation_id)
      .subscribe(() => {
        this.removeConversation(conversation_id);
      });
  }

  public exitGroupConversation(conversation_id: string) {
    this.conversation_service
      .exitConversation(conversation_id)
      .subscribe(() => {
        this.removeConversation(conversation_id);
      });
  }

  private removeConversation(conversation_id: string) {
    this.conversation_service.deleteGroupConversationInStore(conversation_id).subscribe();
    this.store.dispatch(new DeleteSelectedConversation());
  }

  public isNotCurrentUser(user_id: string): boolean {
    return user_id !== this.conversation_service.getUserId();
  }

  public getRelatedUsersNotInConversation(): Array<ConversationMemberPresenter> {
    return Array
      .from(this.related_users.values())
      .filter(
        (user) =>
          !this.selected_conversation.conversation_members.find(
            (member) => member.member_id === user.member_id
          )
      )
      .sort(
        (a, b) =>
          a.member_name.localeCompare(b.member_name)
      );
  }

  public editGroupConversationDetails(conversation_id: string) {
    if (this.edited_conversation_name === '') return;
    this.conversation_service
      .editGroupConversationDetails(conversation_id, { conversation_name: this.edited_conversation_name })
      .subscribe((conversation_details: GroupConversationDetails) => {
        this.conversation_service.editGroupConversationDetailsInStore(conversation_id, conversation_details).subscribe();
        this.clearGroupConversationDetails();
        showSuccessPopup('Los detalles de la conversación se han actualizado');
      }, (err) => {
        this.clearGroupConversationDetails();
        showErrorPopup(err.error.error);
      });
    this.toggleEditingGroupConversationDetails();
  }

  public clearGroupConversationDetails() {
    this.edited_conversation_name = '';
  }

  public addMembersToExistingConversation() {
    const conversation_id = this.selected_conversation.conversation_id;
    this.conversation_service.addMembersToExistingConversation(
      this.selected_conversation.conversation_id,
      Array
        .from(this.conversation_members_to_add.values())
        .map((member) => member.member_id)
    ).subscribe((response: AddedMembersPresenter) => {
      const added_members: Array<ConversationMemberPresenter> = response.added_members.map(
        (member) =>
          ({
            member_id: member.user_id,
            member_name: member.name
          })
      );
      this.conversation_service.addNewMembersToGroupConversationInStore(conversation_id, added_members).subscribe();
      this.isNotAddingGroupConversationMembers();
    }, (err) => {
      this.isNotAddingGroupConversationMembers();
      showErrorPopup(err.error.error);
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

  public addMemberToExistingConversation(member: ConversationMemberPresenter) {
    const member_id: string = member.member_id;
    if (!this.conversation_members_to_add.has(member_id)) {
      this.conversation_members_to_add.set(member_id, member);
      this.related_users_not_in_conversation.delete(member_id);
    }
  }

  public undoAddingMemberToExistingConversation(member: ConversationMemberPresenter) {
    if (this.conversation_members_to_add.has(member.member_id)) {
      this.related_users_not_in_conversation.set(member.member_id, member);
      this.conversation_members_to_add.delete(member.member_id);
    }
  }

  public getPrivateConversationName(): string {
    for (const member of this.private_conversations.get(this.selected_conversation.conversation_id).conversation_members) {
      if (member.member_id !== this.conversation_service.getUserId()) {
        return member.member_name;
      }
    }
    return '';
  }
}
