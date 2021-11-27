import { NgModule } from '@angular/core'
import { ConversationsComponent } from './components/conversations/conversations.component'
import { ChatComponent } from './chat.component'
import { CurrentConversationComponent } from './components/current-conversation/current_conversation.component'

@NgModule({
  declarations: [
    ChatComponent,
    ConversationsComponent,
    CurrentConversationComponent
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule {}
