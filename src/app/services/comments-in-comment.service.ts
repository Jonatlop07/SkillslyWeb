import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsInCommentService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}


  getComments(ancestorCommentID: string, page: number, limit: number) {
    return this.http.get(
      `${this.API_URL}/comments/${ancestorCommentID}/comments`,
      {
        params: { page: page, limit: limit },
        ...this.jwt_service.getHttpOptions(),
      }
    );
  }

  sendComment(ancestorCommentID: string, comment: string) {
    return this.http.post(
      `${this.API_URL}/comments/${ancestorCommentID}/comment`,
      { comment: comment, timestamp: moment().format('YYYY-MM-DDTHH:mm:ss') },
      this.jwt_service.getHttpOptions()
    );
  }

}
