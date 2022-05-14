import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../core/service/jwt.service';

@Injectable()
export class CommentsService {
  private readonly API_URL: string = environment.API_URL;
  public isChargingComments = false;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService,
    private readonly apollo: Apollo
  ) {}

  public getComments(
    post_id: string,
    page: number,
    limit: number
  ): Observable<ApolloQueryResult<any>> {
    const GET_COMMENTS = gql`
      query queryComments($post_id: ID!, $limit: Int, $page: Int) {
        queryComments(
          post_id: $post_id
          comments_pagination: { limit: $limit, page: $page }
        ) {
          _id
          owner_id
          description
          media_locator
          created_at
          inner_comment_count
        }
      }
    `;
    this.isChargingComments = true;
    return this.apollo
      .watchQuery({
        query: GET_COMMENTS,
        variables: {
          post_id,
          page,
          limit,
        },
      })
      .valueChanges.pipe(
        tap(() => {
          this.isChargingComments = false;
        })
      );
  }

  public sendComment(
    post_id: string,
    comment: string,
    media_locator:string
  ): Observable<MutationResult> {
    const CREATE_COMMENT = gql`
      mutation createComment(
        $post_id: ID!
        $description: String
        $media_locator: String
        $owner_id: ID!
      ) {
        createComment(
          post_id: $post_id,
          comment_details: {
            description: $description,
            media_locator: $media_locator
            owner_id: $owner_id
          }
        ) {
          _id,
          description,
          media_locator,
          created_at,
          owner_id
        }
      }
    `;

    return this.apollo.mutate({
      mutation: CREATE_COMMENT,
      variables: {
        post_id,
        description: comment,
        media_locator,
        owner_id: this.jwt_service.getUserId(),
      },
    });
  }

  public editComment(
    comment_id: string,
    description: string,
    media_locator: string
  ): Observable<MutationResult> {
    const UPDATE_COMMENT = gql`
      mutation updateComment(
        $comment_id: ID!
        $description: String
        $media_locator: String
      ) {
        updateComment(
          comment_id: $comment_id
          new_content: {
            description: $description
            media_locator: $media_locator
          }
        ) {
          description,
          media_locator
        }
      }
    `;

    return this.apollo.mutate({
      mutation: UPDATE_COMMENT,
      variables: {
        comment_id,
        description,
        media_locator,
      },
    });
  }

  public deleteComment(comment_id: string): Observable<MutationResult> {
    const DELETE_COMMENT = gql`
      mutation deleteComment($comment_id: ID!) {
        deleteComment(comment_id: $comment_id)
      }
    `;

    return this.apollo.mutate({
      mutation: DELETE_COMMENT,
      variables: {
        comment_id,
      },
    });
  }
}
