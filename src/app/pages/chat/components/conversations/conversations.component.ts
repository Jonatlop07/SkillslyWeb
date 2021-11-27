import { Component, Input } from '@angular/core'
import { ConversationPresenter } from '../../../../interfaces/presenter/chat/conversation.presenter'

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent {
  @Input('conversations') conversations: Array<ConversationPresenter>;

}
