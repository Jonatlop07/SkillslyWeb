import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePostDataPresenter, PostContentData } from '../interfaces/presenter/post/create_post_data.presenter';
import { toPost } from '../interfaces/presenter/post/post_form_data.presenter';
import { JwtService } from './jwt.service';
import { DeletePostInterface } from '../interfaces/delete_post.interface';
import { PermanentPostPresenter, QueryPostPresenter } from '../interfaces/presenter/post/query_post.presenter';
import { SharePostInterface } from '../interfaces/share_post.interface';
import { Select } from '@ngxs/store'
import { SessionState } from '../shared/state/session/session.state'
import { Observable } from 'rxjs'
import { SessionModel } from '../models/session.model'
import { UpdatePostPresenter } from '../interfaces/presenter/post/update_post.presenter'


@Injectable({ providedIn: 'root' })
export class PostService {
  @Select(SessionState) session$: Observable<SessionModel>;

  private readonly API_URL: string = environment.API_URL;
  toggleCreate = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) { }

  createPost(post: CreatePostDataPresenter) {
    const content = toPost(post);
    return this.http
      .post(
        `${this.API_URL}/permanent-posts`,
        {
          content: content,
        },
        this.jwtService.getHttpOptions()
      )
      .subscribe((created_post) => {
        console.log(created_post);
      });
  }

  queryPostCollection(queryPostParams: QueryPostPresenter) {
    let params = new HttpParams();
    params = params.append('user_id', queryPostParams.user_id);
    return this.http
      .get(
        `${this.API_URL}/permanent-posts`,
        {
          params,
          ...this.jwtService.getHttpOptions(),
        }
      );
  }
  deletePost(deletePostInterface: DeletePostInterface) {
    return this.http
      .delete(
        `${this.API_URL}/permanent-posts/${deletePostInterface.post_id}/delete`,
        this.jwtService.getHttpOptions()
      );
  }

  queryPost(post_id: string): Observable<PermanentPostPresenter> {
    return this.http
      .get<PermanentPostPresenter>(
        `${this.API_URL}/permanent-posts/${post_id}`,
        this.jwtService.getHttpOptions()
      );
  }

  updatePermanentPost(post_to_update: UpdatePostPresenter): Observable<UpdatePostPresenter> {
    return this.http.put<UpdatePostPresenter>(
      `${this.API_URL}/permanent-posts/${post_to_update.post_id}`,
      {
        user_id: this.jwtService.getUserId(),
        content: post_to_update.content,
      },
      this.jwtService.getHttpOptions()
    );
  }

  sharePost(sharePostInterface: SharePostInterface) {
    return this.http
      .post(
        `${this.API_URL}/permanent-posts/${sharePostInterface.post_id}/share`,
        {
          user_id: this.jwtService.getUserId()
        },
        this.jwtService.getHttpOptions()
      );
  }

  onToggleCreate() {
    this.toggleCreate = !this.toggleCreate;
  }
}
