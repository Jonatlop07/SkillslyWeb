import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register_form.interface';
import { environment } from 'src/environments/environment';

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
}
