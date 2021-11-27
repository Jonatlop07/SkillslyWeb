import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { JwtService } from './jwt.service'
import { MessagePresenter } from '../interfaces/presenter/chat/message.presenter'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API_URL: string = environment.API_URL;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getMessages(conversation_id: string): Observable<Array<MessagePresenter>> {
    return this.http
      .get<Array<MessagePresenter>>(
        `${this.API_URL}/chat/${encodeURIComponent(conversation_id)}/message`,
        this.jwt_service.getHttpOptions()
      );
  }
}
