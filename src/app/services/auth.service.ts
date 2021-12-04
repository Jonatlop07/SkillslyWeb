import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register_form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login_form.inteface';
import { JwtService } from './jwt.service'
import { LoginResponse } from '../interfaces/login_response.interface'
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
    return this.http.post(`${this.API_URL}/users/account`, registerForm, {
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

  public setSessionData(session_data: SessionModel): Observable<void> {
    return this.store.dispatch(new SetSessionData(session_data));
  }

  public logout(): Observable<void> {
    return this.store.dispatch(
      new SetSessionData({
        user_id: '',
        user_email: '',
        user_roles: [],
        access_token: '',
        expires_date: ''
      }
    ));
  }

  public isUserAuthenticated() {
    return this.jwt_service.isUserAuthenticated();
  }

  public getUserId(): string {
    return this.jwt_service.getUserId();
  }
}
