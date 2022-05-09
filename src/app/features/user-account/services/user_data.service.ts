import { environment } from '../../../../environments/environment'
import { Injectable } from '@angular/core'
import { JwtService } from '../../../core/service/jwt.service'
import { UserDataPresenter } from '../types/user_data.presenter'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()
export class UserDataService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getUserData(user_id: string): Observable<UserDataPresenter> {
    return this.http.get<UserDataPresenter>(
      `${this.API_URL}/users/data/${user_id}`,
      this.jwt_service.getHttpOptions()
    );
  }
}
