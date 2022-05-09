import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { JwtService } from '../../authentication/services/jwt.service'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class NotificationSocket extends Socket {
  constructor(private readonly jwt_service: JwtService) {
    super({
      url: `${environment.SOCKET_SERVER_URL}/notification`,
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
