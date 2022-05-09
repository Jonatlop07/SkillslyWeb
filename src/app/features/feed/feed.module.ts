import { NgModule } from '@angular/core'
import { FeedView } from './views/feed.view'
import { SharedModule } from '../../shared/shared.module'
import { StoryModule } from '../story/story.module'
import { PostModule } from '../post/post.module'
import { TabViewModule } from 'primeng/tabview'
import { FeedRoutingModule } from './feed.routing'

@NgModule({
  declarations: [
    FeedView
  ],
  imports: [
    FeedRoutingModule,
    SharedModule,
    StoryModule,
    PostModule,
    TabViewModule
  ]
})
export class FeedModule {}
