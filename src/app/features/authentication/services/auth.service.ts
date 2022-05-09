import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { LoginResponse } from '../types/login_response.interface'
import { Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { LoginForm } from '../types/login_form.inteface'
import { RegisterForm } from '../types/register_form.interface'
import { requestResetPasswordInterface } from '../types/request_reset_password.interface'
import { JwtService } from './jwt.service'
import { SessionModel } from '../model/session.model'
import { SetSessionData } from '../../../shared/state/session/session.actions'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store,
    private readonly jwt_service: JwtService
  ) {}

  public registerUser(registerForm: RegisterForm): Observable<any> {
    return this.http.post(`${this.API_URL}/users/account`, {
      ...registerForm,
      is_requester: false,
      is_investor: false
    }, {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    });
  }

  public loginUser(loginForm: LoginForm): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, loginForm, {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
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

  public requestResetPassword(request: requestResetPasswordInterface){
    const {email} = request;
    return this.http.patch(
      `${this.API_URL}/auth/request-reset-password`, {
        email: email
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public resetPassword(password: string, token: string){
    console.log(password, token);
    return this.http.patch(
      `${this.API_URL}/auth/reset-password/${token}`, {
        password: password,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public setSessionData(session_data: SessionModel): Observable<void> {
    return this.store.dispatch(new SetSessionData(session_data));
  }

  public logout(): Observable<void> {
    return this.store.dispatch(
      new SetSessionData({
        user_id: '',
        customer_id: '',
        user_email: '',
        user_roles: [],
        access_token: '',
        expires_date: '',
        is_two_factor_auth_enabled: null
      }
    ));
  }

  public isUserAuthenticated() {
    return this.jwt_service.isUserAuthenticated();
  }

  public getUserId(): string {
    return this.jwt_service.getUserId();
  }

  public verifyCaptcha(token: string){
    return this.http.post(`${this.API_URL}/auth/val-captcha`, {
      response: token
    });
  }
}
