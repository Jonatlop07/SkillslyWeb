import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account/account.component'
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';
import { SharePostComponent } from './share-post/share-post.component';
import { PostsQueryComponent } from './user/posts/posts-query/posts-query.component';
import { ChatComponent } from './chat/components/chat.component';
import { PostUpdateComponent } from './user/posts/post-update/post-update.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'search/:searchInput', component: SearchComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'posts', component: PostsCreateComponent },
  { path: 'share-post', component: SharePostComponent },
  { path: 'query/:searchPost', component: PostsQueryComponent },
  { path: 'conversations', component: ChatComponent },
  { path: 'post/update/:post_id', component: PostUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildRoutesModule {
}
