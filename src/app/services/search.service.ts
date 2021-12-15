import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { SearchUserInputForm } from '../interfaces/search_users_input_form.interface';
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly API_URL: string = environment.API_URL;

  constructor(private readonly http: HttpClient, private readonly jwt_service: JwtService) { }

  public searchUser(searchUserForm: SearchUserInputForm){
    let params = new HttpParams();
    params = params.append('email', searchUserForm.email);
    params = params.append('name', searchUserForm.name);
    return this.http.get(
      `${this.API_URL}/users`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    );
  }

  public getUserId(){
    return this.jwt_service.getUserId();
  }
}
