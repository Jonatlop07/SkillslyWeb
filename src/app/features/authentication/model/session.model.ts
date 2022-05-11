export interface SessionModel {
  user_id: string;
  user_email: string;
  access_token: string;
  expires_date: string;
  is_two_factor_auth_enabled: boolean;
}
