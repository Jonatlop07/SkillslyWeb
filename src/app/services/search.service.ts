import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { SearchUserForm } from '../interfaces/search_users_response.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly API_URL: string = environment.API_URL;

  constructor(private readonly http: HttpClient, private readonly jwt_service: JwtService) { }

  public searchUser(searchUserForm: SearchUserForm){
    return this.http.post(`${this.API_URL}/users/search`,searchUserForm,this.jwt_service.getHttpOptions())
  }
}
