import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}
  getComments(postID: string, page: number, limit: number) {
    return this.http.get(`${this.API_URL}/permanent-posts/${postID}/comments`, {
      params: { page: page, limit: limit },
      ...this.jwt_service.getHttpOptions(),
    });
  }

  sendComment(postID: string, comment: string) {
    return this.http.post(
      `${this.API_URL}/permanent-posts/${postID}/comment`,
      { comment: comment, timestamp: moment().format('YYYY-MM-DDTHH:mm:ss') },
      this.jwt_service.getHttpOptions()
    );
  }
}
