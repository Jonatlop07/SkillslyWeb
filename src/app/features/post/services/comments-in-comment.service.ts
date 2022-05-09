import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { JwtService } from '../../authentication/services/jwt.service'
import { environment } from '../../../../environments/environment'
import * as moment from 'moment'
import { PostModule } from '../post.module'

@Injectable({
  providedIn: PostModule,
})
export class CommentsInCommentService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getComments(ancestor_comment_id: string, page: number, limit: number) {
    return this.http.get(
      `${this.API_URL}/comments/${ancestor_comment_id}/comments`,
      {
        params: { page, limit },
        ...this.jwt_service.getHttpOptions(),
      }
    );
  }

  public sendComment(ancestor_comment_id: string, comment: string) {
    return this.http.post(
      `${this.API_URL}/comments/${ancestor_comment_id}/comment`,
      { comment: comment, timestamp: moment().format('YYYY-MM-DDTHH:mm:ss') },
      this.jwt_service.getHttpOptions()
    );
  }
}
