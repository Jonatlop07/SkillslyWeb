import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Profile from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  createProfile(profile: Profile){
     return this.http.post('http://localhost:3000/api/v1/profiles/create', profile);    
  }

}
