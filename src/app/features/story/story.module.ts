import { NgModule } from '@angular/core'
import { StoryComponent } from './components/story/story.component'
import { StoryGalleryComponent } from './components/story-gallery/story-gallery.component'
import { StoriesComponent } from './components/stories/stories.component'
import { StoryService } from './services/story.service'
import { UserAccountModule } from '../user-account/user_account.module'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { RippleModule } from 'primeng/ripple'
import { GalleriaModule } from 'primeng/galleria'
import { TagModule } from 'primeng/tag'
import { ImageModule } from 'primeng/image'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    StoriesComponent,
    StoryComponent,
    StoryGalleryComponent
  ],
  imports: [
    SharedModule,
    CardModule,
    TagModule,
    DialogModule,
    ButtonModule,
    GalleriaModule,
    RippleModule,
    ImageModule,
    UserAccountModule,
  ],
  providers: [
    StoryService
  ],
  exports: [
    StoriesComponent
  ]
})
export class StoryModule {}
