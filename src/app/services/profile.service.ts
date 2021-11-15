import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Profile from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  API_URL = environment.API_URL;

  httpOptions = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  constructor(private http: HttpClient) {}

  createProfile(profile: Profile) {
    return this.http.post(`${this.API_URL}/profile`, profile, this.httpOptions);
  }

  getProfile(email: string) {
    return this.http.get(`${this.API_URL}/profile`, {
      params: new HttpParams().set('userEmail', email),
      ...this.httpOptions,
    });
  }

  updateProfile(profile: Profile) {
    return this.http.put(`${this.API_URL}/profile`, profile, this.httpOptions);
  }
}
