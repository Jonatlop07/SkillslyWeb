import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { GetAccountDataPresenter } from '../interfaces/presenter/get_account_data.presenter'
import { JwtService } from './jwt.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable()
export class AccountService {
  private readonly API_URL: string = environment.API_URL;
  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserAccountData(user_id: string): Observable<GetAccountDataPresenter> {
    return this.http.get<GetAccountDataPresenter>(
      `${this.API_URL}/users/account/${user_id}`,
      this.jwt_service.http_options
    );
  }
}
