import { PagesComponent } from './pages.component'
import { NgModule } from '@angular/core'
import { TabViewModule } from 'primeng/tabview'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { FeedView } from './feed/feed.view'
import { StoryModule } from '../features/story/story.module'
import { PostModule } from '../features/post/post.module'

@NgModule({
  declarations: [
    PagesComponent,
    FeedView
  ],
  imports: [
    SharedModule,
    TabViewModule,
    RouterModule,
    StoryModule,
    PostModule
  ],
})
export class PagesModule {
}
