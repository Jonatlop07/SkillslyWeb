import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../core/service/jwt.service'

@Injectable()
export class CommentsService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}
  getComments(post_id: string, page: number, limit: number) {
    return this.http.get(`${this.API_URL}/permanent-posts/${post_id}/comments`, {
      params: { page: page, limit: limit },
      ...this.jwt_service.getHttpOptions(),
    });
  }

  sendComment(post_id: string, comment: string) {
    return this.http.post(
      `${this.API_URL}/permanent-posts/${post_id}/comment`,
      { comment: comment, timestamp: moment().format('YYYY-MM-DDTHH:mm:ss') },
      this.jwt_service.getHttpOptions()
    );
  }
}
