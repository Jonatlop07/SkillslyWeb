import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { JwtService } from '../../../core/service/jwt.service'
import Story from '../model/story.model'
import { Apollo, gql } from 'apollo-angular'
import { Observable } from 'rxjs'
import { ApolloQueryResult } from '@apollo/client/core'

@Injectable()
export class StoryService {
  private readonly API_URL: string = environment.API_URL;
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public sendStory(story: Story) {
    const CREATE_STORY = gql`
        mutation createStory(
            $owner_id: ID!,
            $description: String,
            $media_locator: String
        ) {
            createStory(
                story_details: {
                    owner_id: $owner_id,
                    description: $description,
                    media_locator: $media_locator
                }
            ) {
                id
                description
                media_locator
                created_at
            }
        }
    `;
    return this.apollo.mutate({
      mutation: CREATE_STORY,
      variables: {
        owner_id: this.jwt_service.getUserId(),
        description: story.description,
        media_locator: story.reference
      }
    });
  }

  public getUserStories() {
    return this.http.get(`${this.API_URL}/temporal-posts`, {
      ...this.jwt_service.getHttpOptions(),
    });
  }

  public getFollowingUsersStories(): Observable<ApolloQueryResult<any>> {
    const QUERY_FOLLOWING_USERS_STORIES = gql`
        query storiesOfFollowingUsers($user_id: String!) {
            storiesOfFollowingUsers(user_id: $user_id) {
                friend_id
                stories {
                    id
                    owner_id
                    description
                    media_locator
                    created_at
                }
            }
        }
    `;
    return this.apollo.watchQuery({
      query: QUERY_FOLLOWING_USERS_STORIES,
      variables: {
        user_id: this.jwt_service.getUserId()
      }
    })
      .valueChanges;
  }

  public deleteStory(story_id: string) {
    const DELETE_STORY = gql`
        mutation deleteStory($id: String!) {
            deleteStory(id: $id) {
                d
                owner_id
                description
                media_locator
                created_at
            }
        }
    `;
    return this.apollo.mutate({
      mutation: DELETE_STORY,
      variables: {
        id: story_id
      }
    });
  }
}
