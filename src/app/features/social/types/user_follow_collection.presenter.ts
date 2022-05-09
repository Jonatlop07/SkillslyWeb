import { User } from '../../user-account/types/user.interface'

export interface UserFollowCollectionPresenter {
  pendingUsers: Array<User>;
  followingUsers: Array<User>;
  followers: Array<User>;
  pendingSentUsers: Array<User>;
}
