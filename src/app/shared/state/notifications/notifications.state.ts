import { NotificationCollectionModel } from '../../notification/model/notification_collection.model'
import { Injectable } from '@angular/core'
import { AddNotification } from './notifications.actions'
import { Action, State, StateContext, StateToken } from '@ngxs/store'

const NOTIFICATIONS_STATE_TOKEN = new StateToken<NotificationCollectionModel>('notifications');

@Injectable({
  providedIn: 'root'
})
@State({
  name: NOTIFICATIONS_STATE_TOKEN,
  defaults: {
    notifications: []
  }
})
export class NotificationsState {
  @Action(AddNotification)
  public addNotification(ctx: StateContext<NotificationCollectionModel>, action: AddNotification) {
    const state = ctx.getState();
    ctx.setState({
      notifications: [
        action.notification,
        ...state.notifications
      ]
    });
  }
}
