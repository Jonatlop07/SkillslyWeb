import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { LoginResponse } from '../../features/authentication/types/login_response.interface'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LoginForm } from '../../features/authentication/types/login_form.inteface'
import { RegisterForm } from '../../features/authentication/types/register_form.interface'
import { requestResetPasswordInterface } from '../../features/authentication/types/request_reset_password.interface'
import { JwtService } from './jwt.service'
import { SessionModel } from '../../features/authentication/model/session.model'
import { SetSessionData } from '../../shared/state/session/session.actions'
import { environment } from '../../../environments/environment'
import { Apollo, gql, MutationResult } from 'apollo-angular'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly apollo: Apollo,
    private readonly store: Store,
    private readonly jwt_service: JwtService
  ) {
  }

  public registerUser(registerForm: RegisterForm): Observable<MutationResult> {
    const REGISTER_USER = gql`
        mutation createUserAccount(
            $email: String!,
            $password: String!,
            $name: String!,
            $date_of_birth: String!,
            $gender: String!
        ) {
            createUserAccount(account_details: {
                email: $email,
                password: $password,
                name: $name,
                date_of_birth: $date_of_birth,
                gender: $gender
            }) {
                id
            }
        }
    `;
    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        date_of_birth: registerForm.date_of_birth,
        gender: "other"
      }
    });
  }

  public loginUser(loginForm: LoginForm): Observable<MutationResult> {
    const LOGIN_USER = gql`
        mutation login(
            $email: String
            $password: String
        ){
            login(
                credentials: {
                    email: $email,
                    password: $password
                }
            ) {
                id
                email
                access_token
            }
        }
    `;
    return this.apollo.mutate({
      mutation: LOGIN_USER,
      variables: {
        email: loginForm.email,
        password: loginForm.password
      }
    });
  }

  public turnOnQRCode(verification_code: string) {
    return this.http.post(
      `${this.API_URL}/2fa/turn-on`, {
        code: verification_code
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public authenticateTwoFactor(authentication_code: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.API_URL}/2fa/authenticate`, {
        code: authentication_code
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public requestResetPassword(request: requestResetPasswordInterface) {
    const { email } = request;
    const REQUEST_RESET_PASSWORD = gql`
        mutation requestResetPassword($email: String!){
            requestResetPassword(email: $email)
        }
    `;
    return this.apollo.mutate({
      mutation: REQUEST_RESET_PASSWORD,
      variables: {
        email
      }
    })
  }

  public resetPassword(password: string, token: string) {
    const RESET_PASSWORD = gql`
        mutation resetPassword($token: String!, $password: String!) {
            resetPassword(token: $token, password: $password)
        }
    `;
    return this.apollo.mutate({
      mutation: RESET_PASSWORD,
      variables: {
        token,
        password
      }
    })
  }

  public setSessionData(session_data: SessionModel): Observable<void> {
    return this.store.dispatch(new SetSessionData(session_data));
  }

  public async logout(): Promise<Observable<void>> {
    const result = this.store.dispatch(
      new SetSessionData({
          user_id: '',
          user_email: '',
          access_token: '',
          expires_date: '',
          is_two_factor_auth_enabled: null
        }
      ));
    await this.apollo.client.resetStore();
    return result;
  }

  public isUserAuthenticated() {
    return this.jwt_service.isUserAuthenticated();
  }

  public getUserId(): string {
    return this.jwt_service.getUserId();
  }
}
