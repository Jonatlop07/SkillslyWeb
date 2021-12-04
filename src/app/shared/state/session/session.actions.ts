import { SessionModel } from '../../../models/session.model'

export class SetSessionData {
  static readonly type = '[Login] Set Session Data';

  constructor(public session_data: SessionModel) {
  }
}

export class UpdateSessionEmail {
  static readonly type = '[Update Account] Update Session Email';

  constructor(public readonly email: string) {}
}


