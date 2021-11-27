import { Component, Input, OnInit } from '@angular/core'
import { MessageService } from '../../../../services/messages.service'

@Component({
  selector: 'app-current-conversation',
  templateUrl: './current_conversation.component.html',
  styleUrls: ['./current_conversation.component.css']
})
export class CurrentConversationComponent implements OnInit {
  @Input('conversation_id') conversation_id: string;

  constructor(
    private readonly message_service: MessageService
  ) {}

  ngOnInit() {

  }
}
