import { Injectable } from '@angular/core'
import { NotificationSocket } from '../socket/notification.socket'
import { Conversation } from '../interfaces/chat/conversation'
import { JwtService } from './jwt.service'
import { User } from '../interfaces/user/user.interface'
import { Observable, of } from 'rxjs'
import UserNotification from '../interfaces/notifications/user_notification'
import { map, mergeAll } from 'rxjs/operators'
import {
  AppendReceivedFollowRequest,
  DeleteSentFollowRequest
} from '../shared/state/follow_requests/follow_requests.actions'
import { Select, Store } from '@ngxs/store'
import { AppendGroupConversation } from '../shared/state/conversations/conversations.actions'
import { AppendFollowingUser } from '../shared/state/following_users/following_users.actions'
import { AddNotification } from '../shared/state/notifications/notifications.actions'
import { NotificationModel } from '../models/notification.model'
import { NotificationsState } from '../shared/state/notifications/notifications.state'
import { NotificationCollectionModel } from '../models/notification_collection.model'
import { StatusUpdateRequestDetails } from '../interfaces/service-requests/status_update_request_details'

@Injectable({ providedIn: 'root' })
export class UserNotificationsService {
  @Select(NotificationsState) notifications$: Observable<NotificationCollectionModel>;

  constructor(
    private readonly socket: NotificationSocket,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {
  }

  private readonly follow_request_received_event = 'follow_request_received';
  private readonly follow_request_accepted_event = 'follow_request_accepted';
  private readonly follow_request_deleted_event = 'follow_request_deleted';
  private readonly added_to_group_conversation_event = 'added_to_group_conversation';
  private readonly service_request_deleted_event = 'service_request_deleted';
  private readonly service_request_updated_event = 'service_request_updated';
  private readonly status_update_request = 'status_update_request';

  public getNotificationsFromStore(): Observable<NotificationCollectionModel> {
    return this.notifications$;
  }

  public onNotificationArrives  () {
    return of(
      this.onFollowRequestAccepted(),
      this.onFollowRequestReceived(),
      this.onFollowRequestDeleted(),
      this.onAddedToNewGroupConversation(),
      this.onServiceRequestDeleted(),
      this.onServiceRequestUpdated(),
      this.onStatusUpdateRequest()
    ).pipe(
      mergeAll()
    );
  }

  public storeNotification(notification: NotificationModel) {
    return this.store.dispatch(new AddNotification(notification));
  }

  private onFollowRequestReceived(): Observable<UserNotification> {
    return this.socket.fromEvent<User>(this.follow_request_received_event)
      .pipe(
        map((follow_request) => {
          this.store.dispatch(new AppendReceivedFollowRequest(follow_request));
          return {
            data: follow_request,
            action_details: {
              route: './follow-requests',
              message: `${follow_request.name} quiere seguirte`
            }
          };
        })
      );
  }

  private onFollowRequestAccepted(): Observable<UserNotification> {
    return this.socket.fromEvent<User>(this.follow_request_accepted_event)
      .pipe(
        map((follow_request) => {
          this.store.dispatch(new DeleteSentFollowRequest(follow_request));
          this.store.dispatch(new AppendFollowingUser(follow_request));
          return {
            data: follow_request,
            action_details: {
              route: `./query/${follow_request.user_id}`,
              message: `Ahora sigues a ${follow_request.name}`
            }
          };
        })
      );
  }

  private onFollowRequestDeleted(): Observable<UserNotification> {
    return this.socket.fromEvent<User>(this.follow_request_deleted_event)
      .pipe(
        map((follow_request) => {
          this.store.dispatch(new DeleteSentFollowRequest(follow_request));
          return {
            data: follow_request
          };
        })
      );
  }

  private onAddedToNewGroupConversation(): Observable<UserNotification> {
    return this.socket.fromEvent<Conversation>(this.added_to_group_conversation_event)
      .pipe(
        map((conversation: Conversation) => {
          this.store.dispatch(new AppendGroupConversation(conversation));
          return {
            data: {
              conversation_id: conversation.conversation_id
            },
            action_details: {
              route: './conversations',
              message: `Has sido añadido a la conversación grupal ${conversation.conversation_name}`
            }
          };
        })
      );
  }

  private onServiceRequestUpdated(): Observable<UserNotification> {
    return this.socket.fromEvent<{
      service_request_id: string,
      service_request_title: string
    }>(this.service_request_updated_event)
      .pipe(
        map(({ service_request_id, service_request_title }) => {
          return {
            data: {
              service_request_id,
              service_request_title
            },
            action_details: {
              route: './service-requests',
              message: `Te informamos que la solicitud de servicio '${service_request_title}' ha sido actualizada`
            }
          };
        })
      );
  }

  private onServiceRequestDeleted(): Observable<UserNotification> {
    return this.socket.fromEvent<{ service_request_title: string }>(this.service_request_deleted_event)
      .pipe(
        map(({ service_request_title }) => {
          return {
            data: null,
            action_details: {
              route: null,
              message: `Te informamos que la solicitud de servicio '${service_request_title}' ha sido eliminada`
            }
          };
        })
      );
  }

  private onStatusUpdateRequest(): Observable<UserNotification> {
    return this.socket.fromEvent<StatusUpdateRequestDetails>(this.status_update_request)
      .pipe(
        map((data: StatusUpdateRequestDetails) => {
          const action = data.update_action === 'complete' ? 'finalizada' : 'cancelada';
          return {
            data,
            action_details: {
              route: './service-requests',
              message: `El usuario ${data.provider_name} ha solicitado la actualización`
                + ` de la etapa de la solicitud de servicio '${data.service_request_title}' a: `
                + `${action}`
            }
          };
        })
      );
  }

  /*
  this.socket.fromEvent<>()
    .pipe(
      map(() => {
        return {
          data: null,
          action_details: {
            route: '',
            message: ''
          }
        };
      })
    );
  * */

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
