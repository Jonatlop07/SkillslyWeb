import { Socket } from 'ngx-socket-io'
import { JwtService } from './jwt.service'
import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService extends Socket {
  constructor(private readonly jwt_service: JwtService) {
    super({
      url: environment.SOCKET_SERVER_URL,
      options: {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${jwt_service.getToken()}`
            }
          }
        },
      }
    });
  }

  public emitEvent(event: string, payload = {}) {
    this.ioSocket.emit(event, payload);
  }
}
