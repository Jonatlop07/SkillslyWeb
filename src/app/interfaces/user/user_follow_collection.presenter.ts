import { User } from "./user.interface";

export interface UserFollowCollectionPresenter {
  pendingUsers: Array<User>;
  followingUsers: Array<User>;
  followers: Array<User>;
  pendingSentUsers: Array<User>;
}
