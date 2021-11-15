import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { GetAccountDataPresenter } from '../interfaces/presenter/get_account_data.presenter'
import { JwtService } from './jwt.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { UpdateUserDataPresenter } from '../interfaces/presenter/update_user_data.presenter'

@Injectable()
export class AccountService {
  private readonly API_URL: string = environment.API_URL;
  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserAccountData(): Observable<GetAccountDataPresenter> {
    return this.http.get<GetAccountDataPresenter>(
      `${this.API_URL}/users/account/${localStorage.getItem('id')}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateUserAccountData(update_user_data: UpdateUserDataPresenter): Observable<GetAccountDataPresenter> {
    return this.http.put<GetAccountDataPresenter>(
      `${this.API_URL}/users/account/${localStorage.getItem('id')}`,
      update_user_data,
      this.jwt_service.getHttpOptions()
    );
  }

  public deleteUserAccount() {
    return this.http.delete(
      `${this.API_URL}/users/account/${localStorage.getItem('id')}`,
      this.jwt_service.getHttpOptions()
    );
  }
}
