import { Injectable } from '@angular/core'
import { JwtService } from './jwt.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ConversationPresenter } from '../interfaces/presenter/chat/conversation.presenter'
import { Observable } from 'rxjs'
import { WebSocketService } from './web_socket.service'
import { MessagePresenter, SendMessagePresenter } from '../interfaces/presenter/chat/message.presenter'
import { NewConversationPresenter } from '../interfaces/presenter/chat/new_conversation.presenter'
import { DeleteConversationPresenter } from '../interfaces/presenter/chat/delete_conversation.presenter'
import { ConversationsPresenter } from '../interfaces/presenter/chat/conversations.presenter'
import { MessageCollectionPresenter } from '../interfaces/presenter/chat/message_collection.presenter'
import { Select, Store } from '@ngxs/store'
import { AppendGroupConversation, StoreConversations } from '../shared/state/conversations/conversations.actions'
import { MyConversationsState } from '../shared/state/conversations/conversations.state'
import { ConversationsModel } from '../models/conversations.model'

@Injectable({ providedIn: 'root' })
export class ChatService {
  @Select(MyConversationsState) conversations$: Observable<ConversationsModel>;

  private readonly API_URL: string = environment.API_URL;

  private readonly join_conversation_event = 'join_conversation';
  private readonly leave_conversation_event = 'leave_conversation';
  private readonly send_message_event = 'send_message_to_conversation';
  private readonly message_sent_event = 'message_sent';
  private readonly delete_message_event = 'delete_message_to_conversation';
  private readonly message_deleted_event = 'message_deleted';

  constructor(
    private readonly http: HttpClient,
    private readonly jtw_service: JwtService,
    private readonly socket_service: WebSocketService,
    private readonly store: Store
  ) {}

  public getConversations(): Observable<ConversationsPresenter> {
    return this.http
      .get<ConversationsPresenter>(
        `${this.API_URL}/chat`,
        this.jtw_service.getHttpOptions()
      );
  }

  public storeConversations(conversations_presenter: ConversationsPresenter): Observable<void> {
    return this.store.dispatch(
      new StoreConversations(
        conversations_presenter.conversations.filter(
          (conversation: ConversationPresenter) => conversation.is_private
        ),
        conversations_presenter.conversations.filter(
          (conversation: ConversationPresenter) => !conversation.is_private
        )
      )
    );
  }

  public getConversationsFromStore() {
    let private_conversations: Array<ConversationPresenter> = [];
    let group_conversations: Array<ConversationPresenter> = [];
    this.conversations$.subscribe((conversations: ConversationsModel) => {
      private_conversations = conversations.private_conversations;
      group_conversations = conversations.group_conversations;
    });
    return {
      private_conversations,
      group_conversations
    }
  }

  public joinConversation(conversation_id: string) {
    return this.socket_service.emitEvent(this.join_conversation_event, {
      conversation_id
    });
  }

  public leaveConversation(conversation_id: string) {
    return this.socket_service.emitEvent(this.leave_conversation_event, {
      conversation_id
    });
  }

  public createConversation(new_conversation: NewConversationPresenter): Observable<ConversationPresenter> {
    return this.http.post<ConversationPresenter>(
      `${this.API_URL}/chat/group`,
      {
        name: new_conversation.conversation_name,
        members: [
          ...new_conversation.conversation_members,
          this.jtw_service.getUserId()
        ]
      },
        this.jtw_service.getHttpOptions()
      );
  }

  public appendGroupConversation(new_conversation: ConversationPresenter): Observable<void> {
    return this.store.dispatch(new AppendGroupConversation(new_conversation));
  }

  public exitConversation(conversation_id: string) {
    return this.http.post(
      `${this.API_URL}/chat/${encodeURIComponent(conversation_id)}/exit`,
      {
        conversation_id
      },
      this.jtw_service.getHttpOptions()
    );
  }

  public deleteConversation(conversation_id: string): Observable<DeleteConversationPresenter> {
    return this.http.delete<DeleteConversationPresenter>(
      `${this.API_URL}/chat/group/${encodeURIComponent(conversation_id)}/`,
      this.jtw_service.getHttpOptions()
    );
  }

  public getMessages(conversation_id: string): Observable<MessageCollectionPresenter> {
    return this.http.get<MessageCollectionPresenter>(
      `${this.API_URL}/chat/${encodeURIComponent(conversation_id)}/messages`,
      this.jtw_service.getHttpOptions()
    );
  }

  public sendMessage(payload: SendMessagePresenter) {
    this.socket_service.emitEvent(
      this.send_message_event,
      {
        user_id: this.jtw_service.getUserId(),
        conversation_id: payload.conversation_id,
        message: payload.message
      }
    );
  }

  public deleteMessage(message: MessagePresenter) {
    this.socket_service.emitEvent(this.delete_message_event, message);
  }

  public onMessageSent() {
    return this.socket_service.fromEvent<MessagePresenter>(this.message_sent_event);
  }

  public onMessageDelete() {
    return this.socket_service.fromEvent<MessagePresenter>(this.message_deleted_event);
  }

  public stop() {
    this.socket_service.disconnect();
  }

  public getUserId(): string {
    return this.jtw_service.getUserId();
  }
}
