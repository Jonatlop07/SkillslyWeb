import { NgModule } from '@angular/core';
import { CreatePostView } from './views/create-post/create_post.view';
import { EditPostView } from './views/edit-post/edit_post.view';
import { CommentInCommentComponent } from './components/comment-in-comment/comment-in-comment.component';
import { CommentComponent } from './components/comment/comment.component';
import { PostComponent } from './components/post/post.component';
import { PostService } from './services/posts.service';
import { UserPostCollectionView } from './views/user-post-collection/user_post_collection.view';
import { PostRoutingModule } from './post.routing';
import { SharedModule } from '../../shared/shared.module';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CommentsService } from './services/comments.service';
import { CommentsInCommentService } from './services/comments-in-comment.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UserDataService } from '../user-account/services/user_data.service';
import { FileUploadService } from './services/file_upload.service';

@NgModule({
  declarations: [
    CommentInCommentComponent,
    CommentComponent,
    PostComponent,
    CreatePostView,
    EditPostView,
    UserPostCollectionView,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RippleModule,
    InputTextModule,
    TooltipModule,
    PostRoutingModule,
    InputTextareaModule,
  ],
  providers: [
    CommentsService,
    CommentsInCommentService,
    PostService,
    UserDataService,
    FileUploadService,
  ],
  exports: [PostComponent],
})
export class PostModule {}
