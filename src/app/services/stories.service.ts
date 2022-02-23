import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Story from '../models/story.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class StoriesService {
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
