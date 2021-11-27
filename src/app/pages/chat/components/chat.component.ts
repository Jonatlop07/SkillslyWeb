import { Component, OnInit } from '@angular/core'
import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter'
import { ChatService } from '../../../services/chat.service'
import { SelectedConversationPresenter } from '../../../interfaces/presenter/chat/selected_conversation.presenter'
import { MessageService } from '../../../services/messages.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversations: Array<ConversationPresenter> = [{
    conversation_name: 'Example conversation',
    conversation_id: '1',
    conversation_members: [localStorage.getItem('user_id')]
  }];
  selected_conversation: SelectedConversationPresenter;

  constructor(
    private readonly chat_service: ChatService,
    private readonly message_service: MessageService
  ) {}

  ngOnInit() {
    /* this.chat_service
      .getConversations()
      .subscribe((conversations: Array<ConversationPresenter>) => {
        this.conversations = conversations;
        this.selected_conversation = this.conversations[0];
        this.selected_conversation
          .conversation_members
          .forEach(
            (member_id: string) => {
              // get name of members by id
            }
          );
        this.message_service
          .getMessages(this.selected_conversation.conversation_id)
          .subscribe((messages: Array<MessagePresenter>) => {
            this.selected_conversation.messages = messages;
          });
      }); */
  }

  public setupGroupConversation() {

  }

  public createConversation() {

  }

  public deleteConversation() {

  }

  public exitConversation() {

  }

  public sendMessage() {

  }
}
