import { JwtService } from '../../service/jwt.service'
import { Select, Store } from '@ngxs/store'
import { Conversation } from '../../../features/chat/types/conversation'
import { map, mergeAll } from 'rxjs/operators'
import { Observable, of } from 'rxjs'
import { Injectable } from '@angular/core'
import { NotificationCollectionModel } from '../model/notification_collection.model'
import { AddNotification } from '../../../shared/state/notifications/notifications.actions'
import { NotificationSocket } from '../socket/notification.socket'
import { User } from '../../../features/user-account/types/user.interface'
import { SharedPermanentPost } from '../../../features/post/types/shared_permanent_post.interface'
import { StatusUpdateRequestDetails } from '../../../features/service-request/types/status_update_request_details'
import { NotificationModel } from '../model/notification.model'
import {
  AppendReceivedFollowRequest,
  DeleteSentFollowRequest
} from '../../../shared/state/follow_requests/follow_requests.actions'
import { AddReactionToPost, RemoveReactionFromPost } from '../../../shared/state/posts/posts.actions'
import {
  AppendGroupConversation,
} from '../../../shared/state/conversations/conversations.actions'
import { PostReaction } from '../../../features/post/types/post_reaction'
import { NotificationsState } from '../../../shared/state/notifications/notifications.state'
import { AppendFollowingUser } from '../../../shared/state/following_users/following_users.actions'
import UserNotification from '../types/user_notification'
import { SharedModule } from '../../../shared/shared.module'

@Injectable({ providedIn: SharedModule })
export class NotificationService {
  @Select(NotificationsState) notifications$: Observable<NotificationCollectionModel>;

  constructor(
    private readonly socket: NotificationSocket,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {
  }

  private readonly follow_request_received_event = 'follow_request_received';
  private readonly follow_request_accepted_event = 'follow_request_accepted';
  private readonly follow_request_rejected_event = 'follow_request_rejected';
  private readonly follow_request_deleted_event = 'follow_request_deleted';
  private readonly shared_permanent_post_event = 'shared_permanent_post';
  private readonly permanent_post_added_reaction_event = 'permanent_post_added_reaction';
  private readonly permanent_post_removed_reaction_event = 'permanent_post_removed_reaction';
  private readonly added_to_group_conversation_event = 'added_to_group_conversation';
  /*private readonly group_conversation_deleted_event = 'group_conversation_deleted';*/
  private readonly service_request_deleted_event = 'service_request_deleted';
  private readonly service_request_updated_event = 'service_request_updated';
  private readonly status_update_request = 'status_update_request';

  public getNotificationsFromStore(): Observable<NotificationCollectionModel> {
    return this.notifications$;
  }

  public onNotificationArrives() {
    return of(
      this.onFollowRequestAccepted(),
      this.onFollowRequestRejected(),
      this.onFollowRequestReceived(),
      this.onFollowRequestDeleted(),
      this.onSharedPermanentPost(),
      this.onPermanentPostAddedReaction(),
      this.onPermanentPostRemovedReaction(),
      this.onAddedToNewGroupConversation(),
      /*this.onGroupConversationDeleted(),*/
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

  private onFollowRequestRejected(): Observable<UserNotification> {
    return this.socket.fromEvent<User>(this.follow_request_rejected_event)
      .pipe(
        map((follow_request) => {
          this.store.dispatch(new DeleteSentFollowRequest(follow_request));
          return {
            data: follow_request
          };
        })
      )
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

  private onSharedPermanentPost(): Observable<UserNotification> {
    return this.socket.fromEvent<SharedPermanentPost>(this.shared_permanent_post_event)
      .pipe(
        map((shared_permanent_post: SharedPermanentPost) => {
            return {
              data: shared_permanent_post,
              action_details: {
                route: `./query/${shared_permanent_post.user_that_shares_id}`,
                message: `${shared_permanent_post.user_that_shares_id} ha compartido una publicación tuya`
              }
            }
          }
        )
      );
  }

  private onPermanentPostAddedReaction(): Observable<UserNotification> {
    return this.socket.fromEvent<PostReaction>(this.permanent_post_added_reaction_event)
      .pipe(
        map((reaction: PostReaction) => {
          this.store.dispatch(new AddReactionToPost(reaction));
          return {
            data: reaction,
            action_details: {
              route: './posts',
              message: `${reaction.reactor_id} ha reaccionado con ${reaction.reaction_type} a una publicación tuya`
            }
          };
        })
      );
  }

  private onPermanentPostRemovedReaction(): Observable<UserNotification> {
    return this.socket.fromEvent<PostReaction>(this.permanent_post_removed_reaction_event)
      .pipe(
        map((reaction: PostReaction) => {
          this.store.dispatch(new RemoveReactionFromPost(reaction));
          return {
            data: reaction
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

  /* private onGroupConversationDeleted(): Observable<UserNotification> {
    return this.socket.fromEvent<ConversationDeletedDetails>(this.group_conversation_deleted_event)
      .pipe(
        map((conversation_deleted_details: ConversationDeletedDetails) => {
            const conversation_to_delete: Conversation = this.conversation_service
              .getConversationsFromStore()
              .group_conversations.find(
                (conversation: Conversation) =>
                  conversation.conversation_id === conversation_deleted_details.conversation_id
              );
            this.store.dispatch(new DeleteGroupConversation(conversation_deleted_details.conversation_id));
            return {
              data: conversation_deleted_details,
              action_details: {
                route: '',
                message: `
                  ${conversation_deleted_details.user_who_deletes_id}
                  ha eliminado la conversación grupal '${conversation_to_delete.conversation_name}'
                `
              }
            };
          }
        )
      );
  }*/


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
}
