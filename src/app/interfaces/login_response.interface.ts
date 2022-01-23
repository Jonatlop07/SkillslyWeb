export interface LoginResponse {
  access_token: string;
  id: string;
  customer_id: string;
  email: string;
  roles: Array<string>;
}
