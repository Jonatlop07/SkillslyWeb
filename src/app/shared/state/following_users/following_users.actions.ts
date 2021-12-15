import { User } from "src/app/interfaces/user.interface";

export class StoreFollowingUsers {
  static readonly type = '[Auth] Store Following Users';

  constructor(public readonly following_users: Array<User>) {}
}
