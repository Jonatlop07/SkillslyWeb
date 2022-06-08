import { user_account_routing_paths } from './features/user-account/user_account.routing'
import { chat_routing_paths } from './features/chat/chat.routing'
import { service_request_routing_paths } from './features/service-request/service_request.routing'
import { social_routing_paths } from './features/social/social.routing'
import { post_routing_paths } from './features/post/post.routing'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { feed_routing_paths } from './features/feed/feed.routing'
import {lalu_routing_paths} from "./features/lalu/lalu.routing";

const routes = [
  {
    path: user_account_routing_paths.user_account,
    loadChildren: () => import('src/app/features/user-account/user_account.module')
      .then(m => m.UserAccountModule)
  },
  {
    path: chat_routing_paths.chat,
    loadChildren: () => import('src/app/features/chat/chat.module')
      .then(m => m.ChatModule)
  },
  {
    path: service_request_routing_paths.service_request,
    loadChildren: () => import('src/app/features/service-request/service_request.module')
      .then(m => m.ServiceRequestModule)
  },
  {
    path: social_routing_paths.social,
    loadChildren: () => import('src/app/features/social/social.module')
      .then(m => m.SocialModule)
  },
  {
    path: post_routing_paths.posts,
    loadChildren: () => import('src/app/features/post/post.module')
      .then(m => m.PostModule)
  },
  {
    path: lalu_routing_paths.lalu,
    loadChildren: () => import('src/app/features/lalu/lalu.module')
      .then(m => m.LaluModule)
  },
  {
    path: feed_routing_paths.feed,
    loadChildren: () => import('src/app/features/feed/feed.module')
      .then(m => m.FeedModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}

