import { SessionState } from "./session/session.state";
import { MyPostsState } from "./posts/posts.state";
import { MyConversationsState } from './conversations/conversations.state'
import { FollowingUsersState } from "./following_users/following_users.state";
import { FollowersState } from "./followers/followers.state";
import { EventsState } from './events/events.state';
import { AssistancesState } from './events/assistances/assistances.state';
import { MyServiceOffersState } from './service-offers/service_offers.state'
import { MyServiceRequestsState } from './service-requests/service_requests.state'
import { NotificationsState } from './notifications/notifications.state'


export const state_list = [
  SessionState,
  MyPostsState,
  MyConversationsState,
  FollowingUsersState,
  FollowersState,
  EventsState,
  AssistancesState,
  MyServiceOffersState,
  MyServiceRequestsState,
  NotificationsState
];
