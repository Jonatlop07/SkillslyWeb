import { JwtService } from '../../../core/service/jwt.service'
import { MessageCollectionPresenter } from '../types/message_collection.presenter'
import { Select, Store } from '@ngxs/store'
import { Conversation } from '../types/conversation'
import { ConversationCollectionPresenter } from '../types/conversation_collection.presenter'
import {
  AddMembersToGroupConversation,
  AppendGroupConversation, DeleteGroupConversation, EditGroupConversationDetails, StoreConversations
} from '../../../shared/state/conversations/conversations.actions'
import { MyConversationsState } from '../../../shared/state/conversations/conversations.state'
import { Injectable } from '@angular/core'
import { tap } from 'rxjs/operators'
import { ConversationMemberPresenter } from '../types/conversation_member.presenter'
import { GroupConversationDetails } from '../types/group_conversation_details'
import { Observable } from 'rxjs'
import { ConversationCollectionModel } from '../model/conversation_collection.model'
import { HttpClient, HttpParams } from '@angular/common/http'
import { DeleteConversationPresenter } from '../types/delete_conversation.presenter'
import { AddedMembersPresenter } from '../types/added_members.presenter'
import { NewConversationDetails } from '../types/new_conversation_details'
import { environment } from '../../../../environments/environment'

@Injectable()
export class ConversationService {
  private is_charging_messages = false;

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
        this.storeConversations(conversations).subscribe();
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

  public getMessages(conversation_id: string, limit: number, offset: number): Observable<MessageCollectionPresenter> {
    let pagination = new HttpParams();
    pagination = pagination.append('limit', limit);
    pagination = pagination.append('offset', offset);
    this.is_charging_messages = true;
    return this.http.get<MessageCollectionPresenter>(
      `${this.API_URL}/chat/${encodeURIComponent(conversation_id)}/messages`, {
        params: pagination,
        ...this.jtw_service.getHttpOptions()
      }
    ).pipe(
      tap(() => {
        this.is_charging_messages = false;
      })
    );
  }

  public getUserId(): string {
    return this.jtw_service.getUserId();
  }

  public isChargingMessages(): boolean {
    return this.is_charging_messages;
  }
}
