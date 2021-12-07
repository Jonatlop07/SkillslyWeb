import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { SearchUserResponse } from '../interfaces/search_users_response.interface';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jtw_service: JwtService
  ) {}

  public getFollowRequests() {
    return this.http.get(
      `${this.API_URL}/users/follow`,
      this.jtw_service.getHttpOptions()
    )
  }

  public createUserFollowRequest(user: SearchUserResponse) {
    return this.http.post(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {},
      this.jtw_service.getHttpOptions()
    )
  }

  public deleteUserFollowRequest(user: SearchUserResponse, isRequest: boolean) {
    let params = new HttpParams();
    params = params.append('isRequest', isRequest.toString());
    return this.http.delete(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {
        params,
        ...this.jtw_service.getHttpOptions()
      }
    )
  }

  public updateFollowRequest(user:SearchUserResponse, accept:boolean){
    return this.http.put(
      `${this.API_URL}/users/follow/${user.user_id}`,
      {
        accept
      },
      this.jtw_service.getHttpOptions()
    )
  }
}
