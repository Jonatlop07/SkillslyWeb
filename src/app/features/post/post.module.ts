import { NgModule } from '@angular/core'
import { CreatePostView } from './views/create-post/create_post.view'
import { EditPostView } from './views/edit-post/edit_post.view'
import { CommentInCommentComponent } from './components/comment-in-comment/comment-in-comment.component'
import { CommentComponent } from './components/comment/comment.component'
import { PostComponent } from './components/post/post.component'
import { PostService } from './services/posts.service'
import { UserPostCollectionView } from './views/user-post-collection/user_post_collection.view'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'
import { InputTextModule } from 'primeng/inputtext'
import { TooltipModule } from 'primeng/tooltip'

@NgModule({
  declarations: [
    CreatePostView,
    EditPostView,
    UserPostCollectionView,
    PostComponent,
    CommentComponent,
    CommentInCommentComponent
  ],
  imports: [
    ReactiveFormsModule,
    InputTextareaModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    TooltipModule,
    FormsModule
  ],
  providers: [
    PostService
  ]
})
export class PostModule {}
