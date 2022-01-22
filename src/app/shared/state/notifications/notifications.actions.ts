import { NotificationModel } from '../../../models/notification.model'

export class AddNotification {
  static readonly type = '[Notification] Add Notification';

  constructor(public readonly notification: NotificationModel) {}
}
