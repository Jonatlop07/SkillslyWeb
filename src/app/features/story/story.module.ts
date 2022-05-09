import { NgModule } from '@angular/core'
import { StoryComponent } from './components/story/story.component'
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { StoryGalleryComponent } from './components/story-gallery/story-gallery.component'
import { GalleriaModule } from 'primeng/galleria'
import { StoriesComponent } from './components/stories/stories.component'
import { UserAccountModule } from '../user-account/user_account.module'
import { RippleModule } from 'primeng/ripple'
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { ImageModule } from 'primeng/image'
import { StoryService } from './services/story.service'

@NgModule({
  declarations: [
    StoriesComponent,
    StoryComponent,
    StoryGalleryComponent
  ],
  imports: [
    CardModule,
    TagModule,
    DialogModule,
    ButtonModule,
    GalleriaModule,
    UserAccountModule,
    RippleModule,
    FormsModule,
    InputTextModule,
    ImageModule
  ],
  providers: [
    StoryService
  ],
  exports: [
    StoriesComponent
  ]
})
export class StoryModule {}
