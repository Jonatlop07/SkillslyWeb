import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateUserDetails } from '../types/update_user_details'
import { JwtService } from '../../../core/service/jwt.service'
import { Apollo, gql } from 'apollo-angular'
import { ApolloQueryResult } from '@apollo/client/core'

@Injectable()
export class AccountService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {
  }

  public getUserAccountData(): Observable<ApolloQueryResult<any>> {
    const QUERY_USER = gql`
        query user($id: String!) {
            user(id: $id) {
                name
                email
                date_of_birth
                gender
            }
        }
    `;
    return this.apollo.watchQuery({
      query: QUERY_USER,
      variables: {
        id: this.jwt_service.getUserId()
      }
    }).valueChanges;
  }

  public updateUserAccountData(update_user_details: UpdateUserDetails): Observable<any> {
    const { email, name, date_of_birth } = update_user_details;
    const UPDATE_USER_DATA = gql`
        mutation updateUserAccount(
            $user_id: ID!,
            $email: String,
            $name: String,
            $date_of_birth: String,
            $gender: String
        ) {
            updateUserAccount(
                user_id: $user_id,
                updates: {
                    email: $email,
                    name: $name,
                    date_of_birth: $date_of_birth,
                    gender: $gender
                }
            ) {
                name
                email
                date_of_birth
                gender
            }
        }
    `;
    return this.apollo.mutate({
      mutation: UPDATE_USER_DATA,
      variables: {
        user_id: this.jwt_service.getUserId(),
        email,
        date_of_birth,
        name,
        gender: 'other'
      }
    });
  }

  public deleteUserAccount(password?: string) {
    const DELETE_USER = gql`
        mutation deleteUserAccount(
            $user_id: ID!,
            $password: String
        ) {
            deleteUserAccount(
                user_id: $user_id,
                password: $password
            ) {
                id
                name
                email
                date_of_birth
                gender
            }
        }
    `;
    return this.apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        user_id: this.jwt_service.getUserId(),
        password
      }
    });
  }

  public generateAuthQRCode() {
    return this.http.post(`${this.API_URL}/2fa/generate`, {}, {
      responseType: 'blob',
      ...this.jwt_service.getHttpOptions()
    });
  }

  public isTwoFactorAuthenticationEnabled(): boolean {
    return this.jwt_service.isTwoFactorAuthenticationEnabled();
  }
}
