import { User } from "src/app/interfaces/user.interface";

export class StoreFollowingUsers {
  static readonly type = '[Auth] Store Following Users';

  constructor(public readonly following_users: Array<User>) {}
}

export class AppendFollowingUser {
  static readonly type = '[Notification] Append Following User';

  constructor(public readonly following_user: User) {}
}
