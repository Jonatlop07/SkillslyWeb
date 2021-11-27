import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { JwtService } from './jwt.service'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService
  ) {}

  public getMessages(conversation_id: string) {
  }
}
