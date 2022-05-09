import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateUserDetails } from '../types/update_user_details'
import { ObtainSpecialRolesData } from '../types/obtain_special_roles_data'
import AccountDataResponse from '../types/account_data.response'
import { JwtService } from '../../authentication/services/jwt.service'
import { UserAccountModule } from '../user_account.module'

@Injectable({
  providedIn: UserAccountModule
})
export class AccountService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserAccountData(): Observable<AccountDataResponse> {
    return this.http.get<AccountDataResponse>(
      `${this.API_URL}/users/account/${encodeURIComponent(this.jwt_service.getUserId())}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateUserAccountData(update_user_details: UpdateUserDetails): Observable<AccountDataResponse> {
    return this.http.put<AccountDataResponse>(
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
