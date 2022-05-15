import { User } from '../../user-account/types/user.interface'

export interface UserFollowCollectionPresenter {
  pending_followers: Array<User>;
  following_users: Array<User>;
  followers: Array<User>;
  pending_users_to_follow: Array<User>;
}
