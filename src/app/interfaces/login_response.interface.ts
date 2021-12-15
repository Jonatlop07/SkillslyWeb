export interface LoginResponse {
  access_token: string;
  id: string;
  email: string;
  roles: Array<string>;
}
