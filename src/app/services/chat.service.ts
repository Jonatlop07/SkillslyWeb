import { Injectable } from '@angular/core'
import { JwtService } from './jwt.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { ConversationPresenter } from '../interfaces/presenter/chat/conversation.presenter'
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jtw_service: JwtService
  ) {}

  public getConversations(): Observable<Array<ConversationPresenter>> {
    return this.http
      .get<Array<ConversationPresenter>>(
        `${this.API_URL}/chat`,
        this.jtw_service.getHttpOptions()
      );
  }
}
