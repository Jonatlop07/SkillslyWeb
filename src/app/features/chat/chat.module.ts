import { NgModule } from '@angular/core'
import ChatView from './views/chat.view'
import { ConversationComponent } from './components/conversation/conversation.component'
import { NewConversationComponent } from './components/new-conversation/new_conversation.component'
import { ConversationListComponent } from './components/conversation-list/conversation_list.component'
import { ChatService } from './services/chat.service'
import { ConversationService } from './services/conversation.service'
import { SocialModule } from '../social/social.module'
import { ChatRoutingModule } from './chat.routing'
import { SharedModule } from '../../shared/shared.module'
import { DialogModule } from 'primeng/dialog'
import { TabViewModule } from 'primeng/tabview'
import { InputTextareaModule } from 'primeng/inputtextarea'

@NgModule({
  declarations: [
    ChatView,
    ConversationListComponent,
    ConversationComponent,
    NewConversationComponent
  ],
  imports: [
    SharedModule,
    DialogModule,
    TabViewModule,
    InputTextareaModule,
    SocialModule,
    ChatRoutingModule,
  ],
  providers: [
    ConversationService,
    ChatService,
  ]
})
export class ChatModule {

}
