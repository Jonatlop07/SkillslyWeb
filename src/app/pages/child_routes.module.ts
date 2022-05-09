import { UserAccountView } from '../features/user-account/views/user_account.view'
import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { routing_paths as user_account_routing_paths } from '../features/user-account/user_account.routing'
import { routing_paths as chat_routing_paths } from '../features/chat/chat.routing'
import { routing_paths as service_request_routing_paths } from '../features/service-request/service_request.routing'
import { routing_paths as social_routing_paths } from '../features/social/social.routing'
import { routing_paths as post_routing_paths } from '../features/post/post.routing'
import ChatView from '../features/chat/views/chat.view'
import { FeedView } from './feed/feed.view'
import { PostsView } from '../features/post/views/posts/posts.view'
import { CreatePostView } from '../features/post/views/create-post/create_post.view'
import { EditPostView } from '../features/post/views/edit-post/edit_post.view'
import { UserPostCollectionView } from '../features/post/views/user-post-collection/user_post_collection.view'
import { ServiceRequestsView } from '../features/service-request/views/service-requests/service_requests.view'
import { FollowRequestsView } from '../features/social/views/follow-requests/follow_requests.view'
import { SearchView } from '../features/social/views/search/search.view'

const routes: Routes = [
  { path: user_account_routing_paths.user_account, component: UserAccountView },
  { path: chat_routing_paths.chat, component: ChatView },
  { path: service_request_routing_paths.service_requests, component: ServiceRequestsView },
  { path: social_routing_paths.search, component: SearchView },
  { path: social_routing_paths.follow_requests, component: FollowRequestsView },
  { path: post_routing_paths.posts, component: PostsView },
  { path: post_routing_paths.create_post, component: CreatePostView },
  { path: post_routing_paths.user_post_collection, component: UserPostCollectionView },
  { path: post_routing_paths.edit_post, component: EditPostView },
  { path: 'feed', component: FeedView }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {
}
