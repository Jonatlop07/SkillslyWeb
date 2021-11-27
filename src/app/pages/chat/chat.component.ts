import { Component, OnInit } from '@angular/core'
import { ConversationPresenter } from '../../interfaces/presenter/chat/conversation.presenter'
import { ChatService } from '../../services/chat.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversations: Array<ConversationPresenter> = [];

  constructor(private readonly chat_service: ChatService) {}

  ngOnInit() {
  }
}
