import { Component, Input, OnInit } from '@angular/core'
import { MessageService } from '../../../../services/messages.service'
import { MessagePresenter } from '../../../../interfaces/presenter/chat/message.presenter'

@Component({
  selector: 'app-current-conversation',
  templateUrl: './current_conversation.component.html',
  styleUrls: ['./current_conversation.component.css']
})
export class CurrentConversationComponent implements OnInit {
  @Input('conversation_id') conversation_id: string;
  messages: Array<MessagePresenter> = [];

  constructor(
    private readonly message_service: MessageService
  ) {}

  ngOnInit() {
    this.message_service
      .getMessages(this.conversation_id)
      .subscribe((messages: Array<MessagePresenter>) => {
        this.messages = messages;
      });
  }
}
