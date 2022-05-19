import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtService } from '../../../core/service/jwt.service';
import { environment } from '../../../../environments/environment';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CommentsInCommentService {
  public isChargingInnerComments = false;
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly apollo: Apollo
  ) {}

  public getInnerComments(
    ancestor_comment_id: string,
    page: number,
    limit: number
  ): Observable<ApolloQueryResult<any>> {
    const GET_INNER_COMMENTS = gql`
      query queryInnerComments($comment_id: ID!, $limit: Int, $page: Int) {
        queryInnerComments(
          comment_id: $comment_id
          inner_comments_pagination: { limit: $limit, page: $page }
        ) {
          owner_id
          description
          media_locator
          comment_id
          created_at
          _id
        }
      }
    `;
    this.isChargingInnerComments = true;
    return this.apollo
      .watchQuery({
        query: GET_INNER_COMMENTS,
        variables: {
          comment_id: ancestor_comment_id,
          page,
          limit,
        },
      })
      .valueChanges.pipe(
        tap(() => {
          this.isChargingInnerComments = false;
        })
      );
  }

  public sendInnerComment(
    ancestor_comment_id: string,
    comment: string,
    media_locator: string
  ): Observable<MutationResult> {
    const CREATE_INNER_COMMENT = gql`
      mutation createInnerComment(
        $comment_id: ID!
        $description: String
        $media_locator: String
        $owner_id: ID!
      ) {
        createInnerComment(
          comment_id: $comment_id
          inner_comment_details: {
            description: $description
            media_locator: $media_locator
            owner_id: $owner_id
          }
        ) {
          _id
          description
          media_locator
          created_at
          comment_id
          owner_id
        }
      }
    `;

    return this.apollo.mutate({
      mutation: CREATE_INNER_COMMENT,
      variables: {
        comment_id: ancestor_comment_id,
        description: comment,
        media_locator,
        owner_id: this.jwt_service.getUserId(),
      },
    });
  }

  public editInnerComment(
    inner_comment_id: string,
    description: string,
    media_locator: string
  ): Observable<MutationResult> {
    const UPDATE_INNER_COMMENT = gql`
      mutation updateInnerComment(
        $inner_comment_id: ID!
        $description: String
        $media_locator: String
      ) {
        updateInnerComment(
          inner_comment_id: $inner_comment_id
          new_content: {
            description: $description
            media_locator: $media_locator
          }
        ) {
          description
          media_locator
        }
      }
    `;

    return this.apollo.mutate({
      mutation: UPDATE_INNER_COMMENT,
      variables: {
        inner_comment_id,
        description,
        media_locator,
      },
    });
  }

  public deleteInnerComment(
    inner_comment_id: string
  ): Observable<MutationResult> {
    const DELETE_INNER_COMMENT = gql`
      mutation deleteInnerComment($inner_comment_id: ID!) {
        deleteInnerComment(inner_comment_id: $inner_comment_id)
      }
    `;

    return this.apollo.mutate({
      mutation: DELETE_INNER_COMMENT,
      variables: {
        inner_comment_id,
      },
    });
  }
}
