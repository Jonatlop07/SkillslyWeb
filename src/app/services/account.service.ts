import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AccountDataPresenter } from '../interfaces/user-account/account_data.presenter'
import { UpdateUserDetails } from '../interfaces/user-account/update_user_details'
import { ObtainSpecialRolesData } from '../interfaces/user-account/obtain_special_roles_data'

@Injectable()
export class AccountService {


  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserAccountData(): Observable<AccountDataPresenter> {
    return this.http.get<AccountDataPresenter>(
      `${this.API_URL}/users/account/${encodeURIComponent(this.jwt_service.getUserId())}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateUserAccountData(update_user_details: UpdateUserDetails): Observable<AccountDataPresenter> {
    return this.http.put<AccountDataPresenter>(
      `${this.API_URL}/users/account/${this.jwt_service.getUserId()}`,
      update_user_details,
      this.jwt_service.getHttpOptions()
    );
  }

  public deleteUserAccount() {
    return this.http.delete(
      `${this.API_URL}/users/account/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public obtainSpecialRoles(obtain_special_roles_data: ObtainSpecialRolesData) {
    return this.http.post(
      `${this.API_URL}/users/account/roles`,
      obtain_special_roles_data,
      this.jwt_service.getHttpOptions()
    );
  }

  public generateAuthQRCode() {
    return this.http.post(`${this.API_URL}/2fa/generate`, {}, {
      responseType: 'blob',
      ...this.jwt_service.getHttpOptions()
    });
  }

  public getUserRoles(): Array<string> {
    return this.jwt_service.getUserRoles();
  }

  public isTwoFactorAuthenticationEnabled(): boolean {
    return this.jwt_service.isTwoFactorAuthenticationEnabled();
  }
}
