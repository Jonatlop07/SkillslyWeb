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
    return this.http.post(`${this.API_URL}/users/account`, registerForm, this.jwt_service.http_options);
  }

  public loginUser(loginForm: LoginForm) {
    const response = this.http.post(`${this.API_URL}/auth/login`, loginForm, this.jwt_service.http_options);
    response.subscribe(
      (result: any) => {
        this.jwt_service.saveToken(result.access_token);
        const now = new Date();
        now.setSeconds(7200);
        this.jwt_service.setExpiresDate(now.getTime().toString());
        localStorage.setItem('id', result.id);
      },
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  public logout(){
    this.jwt_service.destroyToken();
    this.jwt_service.expireToken();
    localStorage.delete('id');
  }

  public isUserAuthenticated() {
    return this.jwt_service.isUserAuthenticated();
  }
}
