import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Select } from '@ngxs/store';
import { SessionState } from '../../../shared/state/session/session.state';
import { JwtService } from '../../../core/service/jwt.service';
import { UpdatePostPresenter } from '../types/update_post.presenter';
import { toPostContent } from '../types/post_form_data.presenter';
import { SessionModel } from '../../authentication/model/session.model';
import { SharePostInterface } from '../types/share_post.interface';
import { DeletePostInterface } from '../types/delete_post.interface';
import {
  PermanentPostPresenter,
  QueryPostPresenter,
} from '../types/query_post.presenter';
import {
  CreatePostDataPresenter,
  PostContentData,
} from '../types/create_post_data.presenter';
import { environment } from '../../../../environments/environment';
import { Apollo, gql } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable()
export class PostService {
  @Select(SessionState) session$: Observable<SessionModel>;

  private readonly API_URL: string = environment.API_URL;

  public toggleCreate = false;
  public isChargingFeedPosts = false;
  public isChargingPosts = false;

  constructor(
    private readonly apollo: Apollo,
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  // public getPostCollection(queryPostParams: QueryPostPresenter) {
  //   const { owner_id, group_id, limit, offset } = queryPostParams;
  //   this.isChargingPosts = true;
  //   return this.http.post(
  //     `${this.API_URL}/permanent-posts/posts`,
  //     { owner_id, group_id, limit, offset },
  //     this.jwtService.getHttpOptions()
  //   ).pipe(tap(()=>{
  //     this.isChargingPosts = false;
  //   }));
  // }
  public getPostCollection(
    queryPostParams: QueryPostPresenter
  ): Observable<ApolloQueryResult<any>> {
    const { owner_id } = queryPostParams;
    const QUERY_POSTS = gql`
      query postsByOwnerId($owner_id: String!) {
        postsByOwnerId(owner_id: $owner_id) {
          posts {
            id
            owner_id
            created_at
            updated_at
            description
            content_element {
              description
              media_locator
            }
          }
          owner {
            name
          }
        }
      }
    `;
    return this.apollo.watchQuery({
      query: QUERY_POSTS,
      variables: {
        owner_id: owner_id,
      },
    }).valueChanges;
  }

  // public queryPost(post_id: string): Observable<PermanentPostPresenter> {
  //   return this.http.get<PermanentPostPresenter>(
  //     `${this.API_URL}/permanent-posts/${encodeURIComponent(post_id)}`,
  //     this.jwt_service.getHttpOptions()
  //   );
  // }

  public queryPost(post_id: string): Observable<ApolloQueryResult<any>> {
    const QUERY_POST = gql`
      query postById($pos_id: String!) {
        postById(post_id: $post_id) {
          id
          owner_id
          created_at
          updated_at
          description
          content_element {
            description
            media_locator
          }
        }
      }
    `;

    return this.apollo.watchQuery({
      query: QUERY_POST,
      variables: {
        post_id: post_id,
      },
    }).valueChanges;
  }

  // public createPost(post: CreatePostDataPresenter, group_id: string) {
  //   const content = toPostContent(post.content_element);
  //   return this.http
  //     .post(
  //       `${this.API_URL}/permanent-posts`,
  //       {
  //         content: content,
  //         privacy: post.privacy,
  //         group_id: group_id
  //       },
  //       this.jwt_service.getHttpOptions()
  //     );
  // }

  public createPost(post: CreatePostDataPresenter) {
    const content_element = toPostContent(post.content_element);
    console.log(content_element);
    const { description, privacy } = post;
    console.log(description);
    console.log(privacy);
    const CREATE_POST = gql`
      mutation createPost(
        $owner_id: ID!
        $description: String
        $privacy: String
        $content_element: [PostContentData]
      ) {
        createPost(
          post_data: {
            owner_id: $user_id
            description: $description
            privacy: $privacy
            content_element: $content_element
          }
        ) {
          id
          owner_id
          created_at
          updated_at
          description
          content_element {
            description
            media_locator
          }
        }
      }
    `;
    console.log(CREATE_POST);
    return this.apollo.mutate({
      mutation: CREATE_POST,
      variables: {
        owner_id: this.jwt_service.getUserId(),
        description,
        privacy,
        content_element: content_element,
      },
    });
  }

  public deletePost(deletePostInterface: DeletePostInterface) {
    const { id, group_id } = deletePostInterface;
    let params = new HttpParams();
    params = params.append('group-id', group_id);
    return this.http.delete(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(id)}`,
      {
        params,
        ...this.jwt_service.getHttpOptions(),
      }
    );
  }

  public updatePermanentPost(
    post_to_update: UpdatePostPresenter
  ): Observable<UpdatePostPresenter> {
    return this.http.put<UpdatePostPresenter>(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(
        post_to_update.id
      )}`,
      {
        user_id: this.jwt_service.getUserId(),
        content: post_to_update.content_element,
        privacy: post_to_update.privacy,
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public sharePost(sharePostInterface: SharePostInterface) {
    return this.http.post(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(
        sharePostInterface.id
      )}/share`,
      {
        user_id: this.jwt_service.getUserId(),
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public getPostsOfFriendsCollection(limit: number, offset: number) {
    if (this.isChargingFeedPosts) {
      return of([]);
    }
    let params = new HttpParams();
    params = params.append('limit', limit);
    params = params.append('offset', offset);
    this.isChargingFeedPosts = true;
    return this.http
      .get(`${this.API_URL}/permanent-posts/posts/friends`, {
        params,
        ...this.jwt_service.getHttpOptions(),
      })
      .pipe(
        tap(() => {
          this.isChargingFeedPosts = false;
        })
      );
  }

  onToggleCreate() {
    this.toggleCreate = !this.toggleCreate;
  }

  getIfReactorEmail() {
    return this.jwt_service.getEmail();
  }

  getUserId() {
    return this.jwt_service.getUserId();
  }
}
