import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { JwtService } from '../../../core/service/jwt.service'
import { SearchUserInputForm } from '../types/search_users_input_form.interface'
import { SearchUserResponse } from '../types/search_users_response.interface'

@Injectable()
export class SearchService {

  private readonly API_URL: string = environment.API_URL;

  constructor(private readonly http: HttpClient, private readonly jwt_service: JwtService) { }

  public searchUser(searchUserForm: SearchUserInputForm): Observable<SearchUserResponse>{
    let params = new HttpParams();
    params = params.append('email', searchUserForm.email);
    params = params.append('name', searchUserForm.name);
    return this.http.get<SearchUserResponse>(
      `${this.API_URL}/users`,
      {
        params,
        ...this.jwt_service.getHttpOptions()
      }
    );
  }

  public getUserId(): string{
    return this.jwt_service.getUserId();
  }
}
