import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register/register_form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login/login_form.inteface';
import { JwtService } from './jwt.service'
import { LoginResponse } from '../interfaces/login/login_response.interface'
import { Observable } from 'rxjs'
import { Store } from '@ngxs/store'
import { SetSessionData } from '../shared/state/session/session.actions'
import { SessionModel } from '../models/session.model'

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

  public registerUser(registerForm: RegisterForm){
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