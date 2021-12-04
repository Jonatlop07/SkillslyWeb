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

@Injectable({ providedIn: 'root' })
export class ChatService {
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
    private readonly socket_service: WebSocketService
  ) {}

  public getConversations() {
    return this.http
      .get<ConversationsPresenter>(
        `${this.API_URL}/chat`,
        this.jtw_service.getHttpOptions()
      );
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
        new_conversation,
        this.jtw_service.getHttpOptions()
      );
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
        user_id: localStorage.getItem('id'),
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
}
