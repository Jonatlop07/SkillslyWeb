import { User } from '../../user-account/types/user.interface'

export interface FollowRequestsModel {
  received_requests: Array<User>;
  sent_requests: Array<User>;
}
