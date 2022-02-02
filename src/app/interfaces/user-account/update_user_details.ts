export interface UpdateUserDetails {
  name: string;
  email: string;
  date_of_birth: string;
  password?: string;
  is_two_factor_auth_enabled: boolean;
}
