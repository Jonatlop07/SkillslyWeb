import { Action, State, StateContext, StateToken } from '@ngxs/store'
import { NotificationCollectionModel } from '../../../models/notification_collection.model'
import { AddNotification } from './notifications.actions'
import { Injectable } from '@angular/core'

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
