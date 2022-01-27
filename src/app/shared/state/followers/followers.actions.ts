import { User } from "src/app/interfaces/user/user.interface";

export class StoreFollowers {
  static readonly type = '[Auth] Store Followers';

  constructor(public readonly followers: Array<User>) {}
}
