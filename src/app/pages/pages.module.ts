import { PagesComponent } from './pages.component'
import { TabViewModule } from 'primeng/tabview'
import { ButtonModule } from 'primeng/button'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { NgModule } from '@angular/core'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { BadgeModule } from 'primeng/badge'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ImageModule } from 'primeng/image'
import { ConfirmPopupModule } from 'primeng/confirmpopup'
import { ChipsModule } from 'primeng/chips'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { DockModule } from 'primeng/dock'
import { ChipModule } from 'primeng/chip'
import { SharedModule } from 'primeng/api'
import { CalendarModule } from 'primeng/calendar'
import { GalleriaModule } from 'primeng/galleria'
import { TooltipModule } from 'primeng/tooltip'
import { TagModule } from 'primeng/tag'
import { UserAccountModule } from '../features/user-account/user_account.module'
import { ChatModule } from '../features/chat/chat.module'
import { NotificationModule } from '../features/notification/notification.module'
import { PostModule } from '../features/post/post.module'
import { ServiceRequestModule } from '../features/service-request/service_request.module'
import { SocialModule } from '../features/social/social.module'
import { StoryModule } from '../features/story/story.module'

const features_modules = [
  UserAccountModule,
  ChatModule,
  NotificationModule,
  PostModule,
  ServiceRequestModule,
  SocialModule,
  StoryModule
];

@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    ConfirmPopupModule,
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
    TooltipModule,
    TabViewModule,
    DialogModule,
    BadgeModule,
    ImageModule,
    TagModule,
    GalleriaModule,
    ChipModule,
    DialogModule,
    ButtonModule,
    DockModule,
    ...features_modules
  ],
})
export class PagesModule {
}
