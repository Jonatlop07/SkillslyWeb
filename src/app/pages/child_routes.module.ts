import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component'
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';
import { PostsQueryComponent } from './user/posts/posts-query/posts-query.component';
import { ChatComponent } from './chat/components/chat.component'
import { FollowRequestComponent } from './follow-request/follow-request.component';
import { PostUpdateComponent } from './user/posts/post-update/post-update.component';
import { FeedComponent } from './feed/feed.component';
import { EventCreateComponent } from './user/events/event-create/event-create.component';
import { MyEventsComponent } from './user/events/my-events/my-events.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'search/:searchInput', component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'posts', component: PostsCreateComponent },
  { path: 'events', component: EventCreateComponent},
  { path: 'my-events', component: MyEventsComponent },
  { path: 'query/:user_id', component: PostsQueryComponent },
  { path: 'conversations', component: ChatComponent }, 
  { path: 'follow-requests', component: FollowRequestComponent},
  { path: 'post/update/:post_id', component: PostUpdateComponent }, 
  { path: 'feed', component: FeedComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {
}
