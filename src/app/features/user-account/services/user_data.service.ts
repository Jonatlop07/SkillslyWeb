import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtService } from '../../../core/service/jwt.service';
import { UserDataPresenter } from '../types/user_data.presenter';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable()
export class UserDataService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly apollo: Apollo
  ) {}

  public getUserData(user_id: string): Observable<UserDataPresenter> {
    return this.http.get<UserDataPresenter>(
      `${this.API_URL}/users/data/${user_id}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public getUserNameAndEmail(
    user_id: string
  ): Observable<ApolloQueryResult<any>> {
    const QUERY_USER = gql`
      query user($id: String!) {
        user(id: $id) {
          name
          email
        }
      }
    `;
    return this.apollo.watchQuery({
      query: QUERY_USER,
      variables: {
        id: user_id,
      },
    }).valueChanges;
  }
}
