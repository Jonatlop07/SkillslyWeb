import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toPostContent } from '../interfaces/presenter/post/post_form_data.presenter';
import { CreatePostDataPresenter } from '../interfaces/presenter/post/create_post_data.presenter';
import { JwtService } from './jwt.service';
import { DeletePostInterface } from '../interfaces/delete_post.interface';
import {
  PermanentPostPresenter,
  QueryPostPresenter,
} from '../interfaces/presenter/post/query_post.presenter';
import { SharePostInterface } from '../interfaces/share_post.interface';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable, of } from 'rxjs';
import { SessionModel } from '../models/session.model';
import { UpdatePostPresenter } from '../interfaces/presenter/post/update_post.presenter';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostService {
  @Select(SessionState) session$: Observable<SessionModel>;

  private readonly API_URL: string = environment.API_URL;
  public toggleCreate = false;
  public isChargingFeedPosts = false;
  public isChargingPosts = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) {}

  createPost(post: CreatePostDataPresenter, group_id: string) {
    const content = toPostContent(post.content);
    return this.http
      .post(
        `${this.API_URL}/permanent-posts`,
        {
          content: content,
          privacy: post.privacy,
          group_id: group_id
        },
        this.jwtService.getHttpOptions()
      );
  }

  queryPostCollection(queryPostParams: QueryPostPresenter) {
    const { user_id, group_id, limit, offset } = queryPostParams;
    this.isChargingPosts = true;
    return this.http.post(
      `${this.API_URL}/permanent-posts/posts`,
      { user_id, group_id, limit, offset },
      this.jwtService.getHttpOptions()
    ).pipe(tap(()=>{
      this.isChargingPosts = false;
    }));
  }

  getPostsOfFriendsCollection(limit: number, offset: number) {
    if (this.isChargingFeedPosts) {
      return of([]);
    }
    let params = new HttpParams();
    params = params.append('limit', limit);
    params = params.append('offset', offset);
    this.isChargingFeedPosts = true;
    return this.http
      .get(`${this.API_URL}/permanent-posts`, {
        params,
        ...this.jwtService.getHttpOptions(),
      })
      .pipe(
        tap(() => {
          this.isChargingFeedPosts = false;
        })
      );
  }

  deletePost(deletePostInterface: DeletePostInterface) {
    const { post_id, group_id } = deletePostInterface;
    return this.http.put(
      `${this.API_URL}/permanent-posts/dele/${post_id}`,
      { group_id: group_id },
      this.jwtService.getHttpOptions()
    );
  }

  queryPost(post_id: string): Observable<PermanentPostPresenter> {
    return this.http.get<PermanentPostPresenter>(
      `${this.API_URL}/permanent-posts/post/${post_id}`,
      this.jwtService.getHttpOptions()
    );
  }

  updatePermanentPost(
    post_to_update: UpdatePostPresenter
  ): Observable<UpdatePostPresenter> {
    return this.http.put<UpdatePostPresenter>(
      `${this.API_URL}/permanent-posts/post/${post_to_update.post_id}`,
      {
        user_id: this.jwtService.getUserId(),
        content: post_to_update.content,
        privacy: post_to_update.privacy,
      },
      this.jwtService.getHttpOptions()
    );
  }

  sharePost(sharePostInterface: SharePostInterface) {
    return this.http.post(
      `${this.API_URL}/permanent-posts/post/${sharePostInterface.post_id}/share`,
      {
        user_id: this.jwtService.getUserId(),
      },
      this.jwtService.getHttpOptions()
    );
  }

  onToggleCreate() {
    this.toggleCreate = !this.toggleCreate;
  }

  getIfReactorEmail() {
    return this.jwtService.getEmail();
  }

  getUserId(){
    return this.jwtService.getUserId();
  }
}
