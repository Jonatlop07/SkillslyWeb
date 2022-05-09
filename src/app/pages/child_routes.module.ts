import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import {
  routing_paths as user_account_routing_paths
} from '../features/user-account/user_account.routing'
import { routing_paths as chat_routing_paths } from '../features/chat/chat.routing'
import {
  routing_paths as service_request_routing_paths
} from '../features/service-request/service_request.routing'
import { routing_paths as social_routing_paths } from '../features/social/social.routing'
import { routing_paths as post_routing_paths } from '../features/post/post.routing'
import { FeedView } from './feed/feed.view'

const routes: Routes = [
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
    path: 'feed', component: FeedView
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class ChildRoutesModule {
}
