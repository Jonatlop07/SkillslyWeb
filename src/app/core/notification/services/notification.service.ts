import { JwtService } from '../../service/jwt.service'
import { Select, Store } from '@ngxs/store'
import { map} from 'rxjs/operators'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { NotificationCollectionModel } from '../model/notification_collection.model'
import { AddNotification } from '../../../shared/state/notifications/notifications.actions'
import { NotificationModel } from '../model/notification.model'
import { NotificationsState } from '../../../shared/state/notifications/notifications.state'
import UserNotification from '../types/user_notification'
import { SharedModule } from '../../../shared/shared.module'
import { Socket } from 'ngx-socket-io'

@Injectable({ providedIn: SharedModule })
export class NotificationService {

  @Select(NotificationsState) notifications$: Observable<NotificationCollectionModel>;

  constructor(
    private readonly socket: Socket,
    private readonly jwt_service: JwtService,
    private readonly store: Store
  ) {
  }

  private readonly new_notification_event = 'new_notification';

  public getNotificationsFromStore(): Observable<NotificationCollectionModel> {
    return this.notifications$;
  }

  public onNotificationArrives() {
    return this.onNewNotificationReceived();
  }

  public storeNotification(notification: NotificationModel) {
    return this.store.dispatch(new AddNotification(notification));
  }

  public join() {
    this.socket.connect();
    return this.socket.emit('join', {
      user_id: this.jwt_service.getUserId()
    });
  }

  public leave() {
    this.socket.emit('leave', {
      user_id: this.jwt_service.getUserId()
    });
    return this.socket.disconnect();
  }

  private onNewNotificationReceived(): Observable<UserNotification> {
    return this.socket.fromEvent(this.new_notification_event)
      .pipe(
        map((data) => {
          //this.store.dispatch(new NotificationReceived(data));
          console.log(data);
          return {
            data,
            action_details: {
              route: '',
              message: ''
            }
          };
        })
      )
  }
}
