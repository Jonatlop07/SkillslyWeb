import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { toPostContent } from '../interfaces/post/post_form_data.presenter';
import { CreatePostDataPresenter } from '../interfaces/post/create_post_data.presenter';
import { JwtService } from './jwt.service';
import { DeletePostInterface } from '../interfaces/post/delete_post.interface';
import {
  PermanentPostPresenter,
  QueryPostPresenter,
} from '../interfaces/post/query_post.presenter';
import { SharePostInterface } from '../interfaces/post/share_post.interface';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable, of } from 'rxjs';
import { SessionModel } from '../models/session.model';
import { UpdatePostPresenter } from '../interfaces/post/update_post.presenter';
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

  public createPost(post: CreatePostDataPresenter, group_id: string) {
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

  public queryPostCollection(queryPostParams: QueryPostPresenter) {
    const { owner_id, group_id, limit, offset } = queryPostParams;
    this.isChargingPosts = true;
    return this.http.post(
      `${this.API_URL}/permanent-posts/posts`,
      { owner_id, group_id, limit, offset },
      this.jwtService.getHttpOptions()
    ).pipe(tap(()=>{
      this.isChargingPosts = false;
    }));
  }

  public getPostsOfFriendsCollection(limit: number, offset: number): Observable<Object> {
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
        ...this.jwtService.getHttpOptions(),
      })
      .pipe(
        tap(() => {
          this.isChargingFeedPosts = false;
        })
      );
  }

  public deletePost(deletePostInterface: DeletePostInterface) {
    const { post_id, group_id } = deletePostInterface;
    let params = new HttpParams();
    params = params.append('group-id', group_id);
    return this.http.delete(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(post_id)}`,
      {
        params,
        ...this.jwtService.getHttpOptions()
      }
    );
  }

  public queryPost(post_id: string): Observable<PermanentPostPresenter> {
    return this.http.get<PermanentPostPresenter>(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(post_id)}`,
      this.jwtService.getHttpOptions()
    );
  }

  public updatePermanentPost(
    post_to_update: UpdatePostPresenter
  ): Observable<UpdatePostPresenter> {
    return this.http.put<UpdatePostPresenter>(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(post_to_update.post_id)}`,
      {
        user_id: this.jwtService.getUserId(),
        content: post_to_update.content,
        privacy: post_to_update.privacy,
      },
      this.jwtService.getHttpOptions()
    );
  }

  public sharePost(sharePostInterface: SharePostInterface) {
    return this.http.post(
      `${this.API_URL}/permanent-posts/${encodeURIComponent(sharePostInterface.post_id)}/share`,
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
