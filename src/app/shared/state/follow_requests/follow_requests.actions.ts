import { User } from 'src/app/features/user-account/types/user.interface'


export class AppendReceivedFollowRequest {
  static readonly type = '[Auth] Append Received Follow Request';

  constructor(public readonly follow_request: User) {}
}

export class DeleteSentFollowRequest {
  static readonly type = '[Auth] Delete Sent Follow Request';

  constructor(public readonly follow_request: User) {}
}
