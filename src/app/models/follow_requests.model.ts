import { User } from "../interfaces/user.interface";

export interface FollowRequestsModel {
  received_requests: Array<User>;
  sent_requests: Array<User>;
}
