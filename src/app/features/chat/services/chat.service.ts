import { Injectable } from '@angular/core'
import { MessagePresenter, SendMessagePresenter } from '../types/message.presenter'
import { ChatSocket } from '../socket/chat.socket'
import { JwtService } from '../../authentication/services/jwt.service'

@Injectable()
export class ChatService {
  constructor(
    private readonly socket: ChatSocket,
    private readonly jtw_service: JwtService,
  ){}

  private readonly join_conversation_event = 'join_conversation';
  private readonly leave_conversation_event = 'leave_conversation';
  private readonly send_message_event = 'send_message_to_conversation';
  private readonly message_sent_event = 'message_sent';
  private readonly delete_message_event = 'delete_message_to_conversation';
  private readonly message_deleted_event = 'message_deleted';

  public joinConversation(conversation_id: string) {
    return this.socket.emitEvent(this.join_conversation_event, {
      conversation_id
    });
  }

  public leaveConversation(conversation_id: string) {
    return this.socket.emitEvent(this.leave_conversation_event, {
      conversation_id
    });
  }

  public sendMessage(payload: SendMessagePresenter) {
    this.socket.emitEvent(
      this.send_message_event,
      {
        owner_id: this.jtw_service.getUserId(),
        conversation_id: payload.conversation_id,
        message: payload.message
      }
    );
  }

  public deleteMessage(message: MessagePresenter) {
    this.socket.emitEvent(this.delete_message_event, message);
  }

  public onMessageSent() {
    return this.socket.fromEvent<MessagePresenter>(this.message_sent_event);
  }

  public onMessageDelete() {
    return this.socket.fromEvent<MessagePresenter>(this.message_deleted_event);
  }

  public stop() {
    this.socket.disconnect();
  }
}
