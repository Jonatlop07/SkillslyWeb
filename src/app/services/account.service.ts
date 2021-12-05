import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GetAccountDataPresenter } from '../interfaces/presenter/user/get_account_data.presenter'
import { UpdateUserDataPresenter } from '../interfaces/presenter/user/update_user_data.presenter'

@Injectable()
export class AccountService {
  private readonly API_URL: string = environment.API_URL;
  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserAccountData(): Observable<GetAccountDataPresenter> {
    return this.http.get<GetAccountDataPresenter>(
      `${this.API_URL}/users/account/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateUserAccountData(update_user_data: UpdateUserDataPresenter): Observable<GetAccountDataPresenter> {
    return this.http.put<GetAccountDataPresenter>(
      `${this.API_URL}/users/account/${this.jwt_service.getUserId()}`,
      update_user_data,
      this.jwt_service.getHttpOptions()
    );
  }

  public deleteUserAccount() {
    return this.http.delete(
      `${this.API_URL}/users/account/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    );
  }
}
