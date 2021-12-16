import {SessionState} from "./session/session.state";
import {MyPostsState} from "./posts/posts.state";
import { MyConversationsState } from './conversations/conversations.state'
import { FollowingUsersState } from "./following_users/following_users.state";
import { FollowersState } from "./followers/followers.state";
import { EventsState } from './events/events.state';


export const state_list = [
  SessionState,
  MyPostsState,
  MyConversationsState,
  FollowingUsersState,
  FollowersState, 
  EventsState
];
