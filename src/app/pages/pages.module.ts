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
import { PostComponent } from './user/posts/post/post.component';
import { CommentComponent } from './user/posts/comment/comment.component';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    PagesComponent,
    AccountComponent,
    SearchComponent,
    ProfileComponent,
    PostsCreateComponent,
    PostsQueryComponent,
    PostComponent,
    CommentComponent,
    
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
    DialogModule
  ],
})
export class PagesModule {}
