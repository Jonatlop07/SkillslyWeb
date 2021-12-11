import { User } from "src/app/interfaces/user.interface";

export class StoreFollowers {
  static readonly type = '[Auth] Store Followers';

  constructor(public readonly followers: Array<User>) {}
}
