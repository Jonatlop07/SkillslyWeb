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
import { StoriesComponent } from './stories/stories.component';
import { BadgeModule } from 'primeng/badge';
import { StoryComponent } from './story/story.component';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { StoryGalleryComponent } from './story-gallery/story-gallery.component';
import { GalleriaModule } from 'primeng/galleria';
import { ChipModule } from 'primeng/chip';

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
    StoriesComponent,
    StoryComponent,
    StoryGalleryComponent,
  ],
  imports: [
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
  ],
})
export class PagesModule {}
