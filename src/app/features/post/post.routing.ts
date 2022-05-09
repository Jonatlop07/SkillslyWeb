import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PostsView } from './views/posts/posts.view'
import { CreatePostView } from './views/create-post/create_post.view'
import { UserPostCollectionView } from './views/user-post-collection/user_post_collection.view'
import { EditPostView } from './views/edit-post/edit_post.view'

export const routing_paths = {
  posts: 'posts',
  create_post: 'create-post',
  user_post_collection: 'posts/:user-id',
  edit_post: 'edit-post'
};

const routes: Routes = [
  {
    path: routing_paths.posts,
    component: PostsView
  },
  {
    path: routing_paths.create_post,
    component: CreatePostView
  },
  {
    path: routing_paths.user_post_collection,
    component: UserPostCollectionView
  },
  {
    path: routing_paths.edit_post,
    component: EditPostView
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {}
