export interface SessionModel {
  user_id: string;
  customer_id: string;
  user_email: string;
  user_roles: Array<string>;
  access_token: string;
  expires_date: string;
  is_two_factor_auth_enabled: boolean;
}
