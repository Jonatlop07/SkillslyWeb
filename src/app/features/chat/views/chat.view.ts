import { Component, OnDestroy, OnInit } from '@angular/core'
import { Conversation } from '../types/conversation'
import { Select } from '@ngxs/store'
import { MyConversationsState } from '../../../shared/state/conversations/conversations.state'
import { FollowersModel } from '../../social/model/followers.model'
import { ConversationMemberPresenter } from '../types/conversation_member.presenter'
import { SelectedConversationPresenter } from '../types/selected_conversation.presenter'
import { ConversationModel } from '../model/conversation.model'
import { Observable, Subject } from 'rxjs'
import { ConversationService } from '../services/conversation.service'
import { FollowersState } from '../../../shared/state/followers/followers.state'
import { FollowingUsersState } from '../../../shared/state/following_users/following_users.state'
import { SelectedConversationState } from '../../../shared/state/conversations/selected_conversation.state'
import { FollowingUsersModel } from '../../social/model/following_users.model'
import { FollowRequestService } from '../../social/services/follow_request.service'


@Component({
  templateUrl: './chat.view.html',
  styleUrls: ['./chat.view.css']
})
export default class ChatView {
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
  ) {
  }
}
