import { NgModule } from '@angular/core'
import ChatView from './views/chat.view'
import { ConversationComponent } from './components/conversation/conversation.component'
import { NewConversationComponent } from './components/new-conversation/new_conversation.component'
import { ConversationListComponent } from './components/conversation-list/conversation_list.component'
import { ChatService } from './services/chat.service'
import { ConversationService } from './services/conversation.service'
import { CommonModule } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { DialogModule } from 'primeng/dialog'
import { FormsModule } from '@angular/forms'
import { TabViewModule } from 'primeng/tabview'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ButtonModule } from 'primeng/button'
import { SocialModule } from '../social/social.module'
import { ChatRoutingModule } from './chat.routing'

@NgModule({
  declarations: [
    ChatView,
    ConversationListComponent,
    ConversationComponent,
    NewConversationComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    SocialModule,
    ChatRoutingModule,
  ],
  providers: [
    ChatService,
    ConversationService
  ]
})
export class ChatModule {

}
