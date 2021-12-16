import { Injectable } from '@angular/core'
import { NotificationSocket } from '../socket/notification.socket'
import { ConversationPresenter } from '../interfaces/presenter/chat/conversation.presenter'
import { JwtService } from './jwt.service'
import { User } from '../interfaces/user.interface'

@Injectable({ providedIn: 'root' })
export class UserNotificationsService {
  constructor(
    private readonly socket: NotificationSocket,
    private readonly jwt_service: JwtService
  ) {}

  private readonly follow_request_received_event = 'follow_request_received';
  private readonly follow_request_accepted_event = 'follow_request_accepted';
  private readonly follow_request_deleted_event = 'follow_request_deleted';
  private readonly added_to_group_conversation_event = 'added_to_group_conversation';

  public onFollowRequestReceived() {
    return this.socket.fromEvent<User>(this.follow_request_received_event);
  }

  public onFollowRequestAccepted() {
    return this.socket.fromEvent<User>(this.follow_request_accepted_event);
  }

  public onFollowRequestDeleted() {
    return this.socket.fromEvent<User>(this.follow_request_deleted_event);
  }

  public onAddedToNewGroupConversation() {
    return this.socket.fromEvent<ConversationPresenter>(this.added_to_group_conversation_event);
  }

  public join() {
    return this.socket.emitEvent('join', {
      user_id: this.jwt_service.getUserId()
    });
  }

  public leave() {
    return this.socket.emitEvent('leave', {
      user_id: this.jwt_service.getUserId()
    });
  }
}
