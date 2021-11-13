import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register_form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login_form.inteface';
import { JwtService } from './jwt.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public registerUser(registerForm: RegisterForm){
    return this.http.post(`${this.API_URL}/users/account`, registerForm, this.jwt_service.getHttpOptions());
  }

  public loginUser(loginForm: LoginForm) {
    return this.http.post(`${this.API_URL}/auth/login`, loginForm, this.jwt_service.getHttpOptions());
  }

  public logout(){
    this.jwt_service.destroyToken();
    this.jwt_service.expireToken();
    localStorage.removeItem('id');
    localStorage.removeItem('email');
  }

  public isUserAuthenticated() {
    return this.jwt_service.isUserAuthenticated();
  }

  public saveToken(token: string) {
    this.jwt_service.saveToken(token);
  }

  public setExpiresDate(expires_date: string) {
    this.jwt_service.setExpiresDate(expires_date);
  }
}
