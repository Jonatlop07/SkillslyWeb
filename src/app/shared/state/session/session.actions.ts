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

export class SetTwoFactorAuthentication {
  static readonly type = '[Login] Update Session Email';

  constructor(public readonly is_two_factor_auth_enabled: boolean) {}
}


