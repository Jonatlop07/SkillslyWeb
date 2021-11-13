import { Injectable } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  public getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    }
  };

  public isUserAuthenticated() {
    const auth_token: string = localStorage.getItem('authToken');
    if (auth_token && auth_token !== '') {
      return this.getExpiresDate() > new Date();
    }
    return false;
  }

  public getToken(): string {
    if (this.isUserAuthenticated()) {
      return localStorage.getItem('authToken');
    }
    return '';
  }

  public saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  public destroyToken() {
    localStorage.removeItem('authToken');
  }

  public getExpiresDate(): Date {
    const expires_date = new Date();
    expires_date.setTime(
      Number(
        Number(
          localStorage.getItem('expiresDate')) || 0
      )
    );
    return expires_date;
  }

  public setExpiresDate(expires_date: string) {
    localStorage.setItem('expiresDate', expires_date);
  }

  expireToken() {
    localStorage.removeItem('expireDate');
  }
}
