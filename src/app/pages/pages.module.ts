import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';
import { PostsQueryComponent } from './user/posts/posts-query/posts-query.component';
import { ChatComponent } from './chat/components/chat.component';
import { PostComponent } from './user/posts/post/post.component';
import { CommentComponent } from './user/posts/comment/comment.component';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { FollowRequestComponent } from './follow-request/follow-request.component';
import { PostUpdateComponent } from './user/posts/post-update/post-update.component';
import { FeedComponent } from './feed/feed.component';
import { ProjectsCreateComponent } from './user/projects/projects-create/projects-create.component';
import { StoriesComponent } from './stories/stories.component';
import { BadgeModule } from 'primeng/badge';
import { StoryComponent } from './story/story.component';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { StoryGalleryComponent } from './story-gallery/story-gallery.component';
import { GalleriaModule } from 'primeng/galleria';
import { ChipModule } from 'primeng/chip';
import { EventComponent } from './user/events/event/event.component';
import { EventCreateComponent } from './user/events/event-create/event-create.component';
import { MyEventsComponent } from './user/events/my-events/my-events.component';
import { UserGroupsComponent } from './groups/user-groups/user-groups.component';
import { GroupsQueryComponent } from './groups/groups-query/groups-query.component';
import { GroupComponent } from './groups/group/group.component';
import { GroupCreateComponent } from './groups/group-create/group-create.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { GroupUpdateComponent } from './groups/group-update/group-update.component';
import { EventUpdateComponent } from './user/events/event-update/event-update.component';
import { ServiceOffersComponent } from './service-offers/service_offers.component'
import {
  MyServiceRequestsComponent
} from './profile/components/my-service-requests/my_service_requests.component'
import { ServiceOfferComponent } from './service-offers/components/service_offer.component'
import { ServiceRequestComponent } from './service-requests/components/service_request.component'
import { ServiceRequestsComponent } from './service-requests/service_requests.component'
import { MyServiceOffersComponent } from './profile/components/my-service-offers/my_service_offers.component'
import {ProjectsQueryComponent} from "./user/projects/projects-query/projects-query.component";
import {ProjectComponent} from "./user/projects/project/project.component";
import { NgxStripeModule } from 'ngx-stripe';


@NgModule({
  declarations: [
    PagesComponent,
    AccountComponent,
    SearchComponent,
    ProfileComponent,
    PostsCreateComponent,
    PostsQueryComponent,
    PostUpdateComponent,
    PostComponent,
    CommentComponent,
    ChatComponent,
    FollowRequestComponent,
    FeedComponent,
    ProjectsCreateComponent,
    ProjectsQueryComponent,
    ProjectComponent,
    StoriesComponent,
    StoryComponent,
    StoryGalleryComponent,
    EventComponent,
    EventCreateComponent,
    MyEventsComponent,
    UserGroupsComponent,
    GroupsQueryComponent,
    GroupComponent,
    GroupCreateComponent,
    GroupUpdateComponent,
    EventUpdateComponent,
    ServiceOffersComponent,
    MyServiceOffersComponent,
    ServiceOfferComponent,
    ServiceRequestsComponent,
    MyServiceRequestsComponent,
    ServiceRequestComponent,
  ],
  imports: [
    ConfirmPopupModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CalendarModule,
    RouterModule,
    ChipsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    TabViewModule,
    DialogModule,
    BadgeModule,
    ImageModule,
    TagModule,
    GalleriaModule,
    ChipModule,
    DialogModule,
    ButtonModule,
    NgxStripeModule.forChild('pk_test_51KKqzTLW8alQ67QMS4GSfh6VTdVVvJH3LFlptoBZQW6yZhoB516uFllbjcmtvDUsuedzrcU12wAbnELdm5b10e6700wWxK7ASu')
  ],
})
export class PagesModule {}
