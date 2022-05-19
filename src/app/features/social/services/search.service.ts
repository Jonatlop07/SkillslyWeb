import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JwtService } from '../../../core/service/jwt.service';
import { SearchUserInputForm } from '../types/search_users_input_form.interface';
// import { SearchUserResponse } from '../types/search_users_response.interface';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { SearchUserQueryParams } from '../types/search_user_query_params.interface';
import { tap } from 'rxjs/operators';

@Injectable()
export class SearchService {
  private readonly API_URL: string = environment.API_URL;
  public isChargingUsers = false;

  constructor(
    private readonly jwt_service: JwtService,
    private readonly apollo: Apollo
  ) {}

  public searchUser(
    searchUserForm: SearchUserInputForm,
    queryParams: SearchUserQueryParams
  ): Observable<ApolloQueryResult<any>> {
    const { limit, offset } = queryParams
      ? queryParams
      : { limit: 0, offset: 0 };
    const SEARCH_USERS = gql`
      query users($name: String!, $email: String!, $limit: Int, $offset: Int) {
        users(
          search_params: {
            name: $name
            email: $email
            limit: $limit
            offset: $offset
          }
        ) {
          name
          email
          date_of_birth
          id
        }
      }
    `;
    this.isChargingUsers = true;
    return this.apollo
      .watchQuery({
        query: SEARCH_USERS,
        variables: {
          name: searchUserForm.name,
          email: searchUserForm.email,
          limit: limit,
          offset: offset,
        },
      })
      .valueChanges.pipe(
        tap(() => {
          this.isChargingUsers = false;
        })
      );
  }

  public getUserId(): string {
    return this.jwt_service.getUserId();
  }
}
