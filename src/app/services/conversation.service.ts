import { Injectable } from '@angular/core'
import { JwtService } from './jwt.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Conversation } from '../interfaces/chat/conversation'
import { Observable } from 'rxjs'
import { NewConversationDetails } from '../interfaces/chat/new_conversation_details'
import { DeleteConversationPresenter } from '../interfaces/chat/delete_conversation.presenter'
import { ConversationCollectionPresenter } from '../interfaces/chat/conversation_collection.presenter'
import { MessageCollectionPresenter } from '../interfaces/chat/message_collection.presenter'
import { Select, Store } from '@ngxs/store'
import {
  AddMembersToGroupConversation,
  AppendGroupConversation,
  DeleteGroupConversation, EditGroupConversationDetails,
  StoreConversations
} from '../shared/state/conversations/conversations.actions'
import { MyConversationsState } from '../shared/state/conversations/conversations.state'
import { ConversationCollectionModel } from '../models/conversation_collection.model'
import { GroupConversationDetails } from '../interfaces/chat/group_conversation_details'
import { AddedMembersPresenter } from '../interfaces/chat/added_members.presenter'
import { ConversationMemberPresenter } from '../interfaces/chat/conversation_member.presenter'

@Injectable({ providedIn: 'root' })
export class ConversationService {
  @Select(MyConversationsState) conversations$: Observable<ConversationCollectionModel>;

  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jtw_service: JwtService,
    private readonly store: Store
  ) {}

  public getAndStoreConversations(): void {
    this.http
      .get<ConversationCollectionPresenter>(
        `${this.API_URL}/chat`,
        this.jtw_service.getHttpOptions()
      ).subscribe((conversations: ConversationCollectionPresenter) => {
        this.storeConversations(conversations).subscribe(() => {});
      });
  }

  private storeConversations(conversations_presenter: ConversationCollectionPresenter): Observable<void> {
    return this.store.dispatch(
      new StoreConversations(
        conversations_presenter.conversations.filter(
          (conversation: Conversation) => conversation.is_private
        ),
        conversations_presenter.conversations.filter(
          (conversation: Conversation) => !conversation.is_private
        )
      )
    );
  }

  public getConversationsFromStore() {
    let private_conversations: Array<Conversation> = [];
    let group_conversations: Array<Conversation> = [];
    this.conversations$.subscribe((conversations: ConversationCollectionModel) => {
      private_conversations = conversations.private_conversations;
      group_conversations = conversations.group_conversations;
    });
    return {
      private_conversations,
      group_conversations
    }
  }

  public createConversation(new_conversation: NewConversationDetails): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.API_URL}/chat/group`,
      {
        name: new_conversation.conversation_name,
        members: [
          ...new_conversation.conversation_members,
          this.jtw_service.getUserId()
        ]
      },
        this.jtw_service.getHttpOptions()
      );
  }

  public appendGroupConversation(new_conversation: Conversation): Observable<void> {
    return this.store.dispatch(new AppendGroupConversation(new_conversation));
  }

  public editGroupConversationDetails(conversation_id: string, conversation_details: GroupConversationDetails)
    : Observable<GroupConversationDetails> {
    return this.http.patch<GroupConversationDetails>(
      `${this.API_URL}/chat/group/${encodeURIComponent(conversation_id)}/`,
      conversation_details,
      this.jtw_service.getHttpOptions()
    );
  }

  public addMembersToExistingConversation(conversation_id: string, members_to_add: Array<string>)
    : Observable<AddedMembersPresenter>{
    return this.http.put<AddedMembersPresenter>(
      `${this.API_URL}/chat/group/${encodeURIComponent(conversation_id)}/add-members`,
      {
        members_to_add
      },
      this.jtw_service.getHttpOptions()
    );
  }

  public exitConversation(conversation_id: string) {
    return this.http.post(
      `${this.API_URL}/chat/group/${encodeURIComponent(conversation_id)}/exit`,
      {},
      this.jtw_service.getHttpOptions()
    );
  }

  public deleteGroupConversation(conversation_id: string): Observable<DeleteConversationPresenter> {
    return this.http.delete<DeleteConversationPresenter>(
      `${this.API_URL}/chat/group/${encodeURIComponent(conversation_id)}/`,
      this.jtw_service.getHttpOptions()
    );
  }

  public deleteGroupConversationInStore(conversation_id: string): Observable<void> {
    return this.store.dispatch(new DeleteGroupConversation(conversation_id));
  }

  public editGroupConversationDetailsInStore(
    conversation_id: string,
    conversation_details: GroupConversationDetails
  ): Observable<void> {
    return this.store.dispatch(new EditGroupConversationDetails(
      conversation_id,
      conversation_details
    ));
  }

  public addNewMembersToGroupConversationInStore(
    conversation_id: string,
    members_to_add: Array<ConversationMemberPresenter>
  ): Observable<void> {
    return this.store.dispatch(
      new AddMembersToGroupConversation(
        conversation_id,
        members_to_add
      )
    );
  }

  public getMessages(conversation_id: string): Observable<MessageCollectionPresenter> {
    return this.http.get<MessageCollectionPresenter>(
      `${this.API_URL}/chat/${encodeURIComponent(conversation_id)}/messages`,
      this.jtw_service.getHttpOptions()
    );
  }

  public getUserId(): string {
    return this.jtw_service.getUserId();
  }
}
