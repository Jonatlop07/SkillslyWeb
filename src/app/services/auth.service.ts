import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register_form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login_form.inteface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  API_URL = environment.API_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http:HttpClient) {}

  registerUser(registerForm:RegisterForm){
    return this.http.post(`${this.API_URL}/users/account`, registerForm, this.httpOptions); 
  }

  loginUser(loginForm:LoginForm){
    return this.http.post(`${this.API_URL}/auth/login`, loginForm, this.httpOptions); 
  }

  userIsAuthenticaded(){
    const token = localStorage.getItem('token') || ''; 
    if (token == '') {
      return false;
    }
    const expires = Number(localStorage.getItem('expires')) || 0;
    const expiresDate = new Date();
    expiresDate.setTime(expires);
    if ( expiresDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('expires'); 
  }
}
