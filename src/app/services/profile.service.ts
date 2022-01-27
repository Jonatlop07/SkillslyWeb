import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Profile from '../interfaces/profile/profile';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  createProfile(profile: Profile) {
    return this.http.post(
      `${this.API_URL}/users/profile`,
      profile,
      this.jwt_service.getHttpOptions()
    );
  }

  getProfile(email: string) {
    return this.http.get(`${this.API_URL}/users/profile`, {
      params: new HttpParams().set('user_email', email),
      ...this.jwt_service.getHttpOptions(),
    });
  }

  updateProfile(profile: Profile) {
    return this.http.put(
      `${this.API_URL}/users/profile`,
      profile,
      this.jwt_service.getHttpOptions()
    );
  }

  getUserEmail() {
    return this.jwt_service.getEmail();
  }
}
