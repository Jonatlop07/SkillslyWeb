import { Component, OnDestroy, OnInit } from '@angular/core'
import { Conversation } from '../types/conversation'
import { Select } from '@ngxs/store'
import { MyConversationsState } from '../../../shared/state/conversations/conversations.state'
import { FollowersModel } from '../../social/model/followers.model'
import { ConversationMemberPresenter } from '../types/conversation_member.presenter'
import { User } from '../../user-account/types/user.interface'
import { SelectedConversationPresenter } from '../types/selected_conversation.presenter'
import { ConversationModel } from '../model/conversation.model'
import { Observable, of, Subject } from 'rxjs'
import { ConversationService } from '../services/conversation.service'
import { FollowersState } from '../../../shared/state/followers/followers.state'
import { mergeAll, takeUntil } from 'rxjs/operators'
//import { MessagePresenter } from '../types/message.presenter'
import { FollowingUsersState } from '../../../shared/state/following_users/following_users.state'
import { SelectedConversationState } from '../../../shared/state/conversations/selected_conversation.state'
import { FollowingUsersModel } from '../../social/model/following_users.model'
//import { ChatService } from '../services/chat.service'
import { FollowRequestService } from '../../social/services/follow_request.service'


@Component({
  templateUrl: './chat.view.html',
  styleUrls: ['./chat.view.css']
})
export default class ChatView implements OnInit, OnDestroy {
  @Select(FollowingUsersState)
  public following_users$: Observable<FollowingUsersModel>;

  @Select(FollowersState)
  public followers$: Observable<FollowersModel>;

  @Select(MyConversationsState.privateConversations)
  public private_conversations$: Observable<Array<Conversation>>;

  @Select(MyConversationsState.groupConversations)
  public group_conversations$: Observable<Array<Conversation>>;

  @Select(SelectedConversationState)
  public selected_conversation_state$: Observable<ConversationModel>;

  public private_conversations_index: Map<string, Conversation> = new Map<string, Conversation>();
  public group_conversations_index: Map<string, Conversation> = new Map<string, Conversation>();
  public selected_conversation: SelectedConversationPresenter;
  public related_users: Map<string, ConversationMemberPresenter> = new Map<string, ConversationMemberPresenter>();

  private unsubscribe = new Subject<void>();

  constructor(
    private readonly conversation_service: ConversationService,
    private readonly follow_service: FollowRequestService,
    //private readonly chat_service: ChatService
  ) {
  }

  public ngOnInit() {
    this.private_conversations$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((conversations) => {
        conversations.forEach((conversation: Conversation) => {
          this.private_conversations_index.set(conversation.conversation_id, conversation);
        })
      });
    this.group_conversations$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((conversations) => {
        conversations.forEach((conversation: Conversation) => {
          this.group_conversations_index.set(conversation.conversation_id, conversation);
        })
      });
    this.selected_conversation_state$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: ConversationModel) => {
        this.selected_conversation = state.conversation;
      });
    /*this.chat_service
      .onMessageSent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((message: MessagePresenter) => {
        this.selected_conversation.messages.push(message);
      });
    this.chat_service
      .onMessageDelete()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((message: MessagePresenter) => {
        let message_to_delete_index = this.selected_conversation.messages.indexOf(message);
        if (message_to_delete_index > -1) {
          this.selected_conversation.messages.splice(message_to_delete_index, 1);
        }
      });*/
    of(this.followers$, this.following_users$)
      .pipe(
        takeUntil(this.unsubscribe),
        mergeAll()
      )
      .subscribe((state) => {
        state.users.forEach((user: User) => this.related_users.set(user.id, {
          member_id: user.id,
          member_name: user.name
        }))
      });
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    /*if (this.selected_conversation)
      this.chat_service.leaveConversation(this.selected_conversation.conversation_id);
    this.chat_service.stop();*/
  }
}
