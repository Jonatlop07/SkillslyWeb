import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { JwtService } from '../../../core/service/jwt.service'
import Story from '../model/story.model'

@Injectable()
export class StoryService {
  private readonly API_URL: string = environment.API_URL;
  constructor(
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  sendStory(story: Story) {
    return this.http.post(`${this.API_URL}/temporal-posts`, story, {
      ...this.jwt_service.getHttpOptions(),
    });
  }

  getUserStories() {
    return this.http.get(`${this.API_URL}/temporal-posts`, {
      ...this.jwt_service.getHttpOptions(),
    });
  }

  getFriendsStories() {
    return this.http.get(`${this.API_URL}/temporal-posts/friends`, {
      ...this.jwt_service.getHttpOptions(),
    });
  }

  deleteStory(temporal_post_id: string) {
    const deleteBody = {
      temporal_post_id: temporal_post_id,
      owner_id: this.jwt_service.getUserId(),
    };

    return this.http.delete(`${this.API_URL}/temporal-posts`, {
      body: deleteBody,
      ...this.jwt_service.getHttpOptions(),
    });
  }
}
