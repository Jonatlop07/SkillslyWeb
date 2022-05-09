export default interface UserNotification {
  data: any;
  action_details?: {
    route: string;
    message: string;
  }
}
