import { User } from 'src/app/features/user-account/types/user.interface'

export class StoreFollowers {
  static readonly type = '[Auth] Store Followers';

  constructor(public readonly followers: Array<User>) {}
}
