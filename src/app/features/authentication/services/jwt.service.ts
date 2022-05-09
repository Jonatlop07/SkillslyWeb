import { Injectable } from '@angular/core'
import { SessionState } from '../../../shared/state/session/session.state'
import { HttpHeaders } from '@angular/common/http'
import { SessionModel } from '../model/session.model'
import { Select } from '@ngxs/store'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  @Select(SessionState) session$: Observable<SessionModel>;

  public getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    }
  }

  public isUserAuthenticated() {
    let auth_token;
    this.session$.subscribe((session) => {
      auth_token = session.access_token;
    })

    if (auth_token && auth_token !== '') {
      return this.getExpiresDate() > new Date();
    }
    return false;
  }

  public getUserId(): string {
    let user_id = '';
    if (this.isUserAuthenticated()) {
      this.session$.subscribe((session) => {
        user_id = session.user_id;
      })
    }
    return user_id;
  }

  public getToken(): string {
    let token = '';
    if (this.isUserAuthenticated()) {
      this.session$.subscribe((session) => {
        token = session.access_token;
      })
    }
    return token;
  }

  public getEmail(): string {
    let user_email = '';
    if (this.isUserAuthenticated()){
      this.session$.subscribe((session) => {
        user_email = session.user_email;
      })
    }
    return user_email;
  }

  public getExpiresDate(): Date {
    let expires_date;
    this.session$.subscribe((session) => {
      expires_date = session.expires_date;
    })
    if (expires_date) {
      return new Date(Number(expires_date));
    }
    return new Date();
  }

  public getUserRoles(): Array<string> {
    let user_roles: Array<string> = [];
    this.session$.subscribe((session) => {
      user_roles = session.user_roles;
    });
    return user_roles;
  }

  public isTwoFactorAuthenticationEnabled(): boolean {
    let tfa_enabled = false;
    this.session$.subscribe((session) => {
      tfa_enabled = session.is_two_factor_auth_enabled;
    });
    return tfa_enabled;
  }
}
