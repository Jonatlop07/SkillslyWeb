import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { PostsQueryComponent } from './posts/posts-query/posts-query.component';
import { ChatComponent } from './chat/chat.component';
import { FollowRequestComponent } from './follow-request/follow-request.component';
import { PostUpdateComponent } from './posts/post-update/post-update.component';
import { FeedComponent } from './feed/feed.component';
import { ProjectsCreateComponent } from './projects/projects-create/projects-create.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { MyEventsComponent } from './events/my-events/my-events.component';
import { UserGroupsComponent } from './groups/user-groups/user-groups.component';
import { GroupsQueryComponent } from './groups/groups-query/groups-query.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupUpdateComponent } from './groups/group-update/group-update.component';
import { EventUpdateComponent } from './events/event-update/event-update.component';
import { ServiceOffersComponent } from './service-offers/service_offers.component'
import { ServiceRequestsComponent } from './service-requests/service_requests.component'
import {ProjectsQueryComponent} from "./projects/projects-query/projects-query.component";
import {ProjectsUpdateComponent} from "./projects/projects-update/projects-update.component";

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'search/:searchInput', component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'posts', component: PostsCreateComponent },
  { path: 'events', component: EventCreateComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'events/update/:event_id', component: EventUpdateComponent },
  { path: 'query/:user_id', component: PostsQueryComponent },
  { path: 'conversations', component: ChatComponent },
  { path: 'follow-requests', component: FollowRequestComponent },
  { path: 'post/update/:post_id', component: PostUpdateComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'projects', component: ProjectsCreateComponent },
  { path: 'projects-query/:user_id', component: ProjectsQueryComponent },
  { path: 'project/update/:project_id', component: ProjectsUpdateComponent },
  { path: 'conversations', component: ChatComponent },
  { path: 'follow-requests', component: FollowRequestComponent },
  { path: 'post/update/:post_id', component: PostUpdateComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'my-groups', component: UserGroupsComponent },
  { path: 'groups', component: GroupsQueryComponent },
  { path: 'group/:groupId', component: GroupComponent },
  { path: 'group/:groupId/admin', component: GroupUpdateComponent },
  { path: 'service-offers', component: ServiceOffersComponent },
  { path: 'service-requests', component: ServiceRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutesModule {}
