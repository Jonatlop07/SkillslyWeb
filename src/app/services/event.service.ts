import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { CreateEventPresenter } from '../interfaces/presenter/event/create_event.presenter';
import { Select } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable } from 'rxjs';
import { SessionModel } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  @Select(SessionState) session$: Observable<SessionModel>;
  
  private readonly API_URL: string = environment.API_URL;
  public isChargingFeedEvents = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) { }

  createEvent(event:CreateEventPresenter) {
    return this.http.post(
      `${this.API_URL}/event`,
      {
        name: event.name, 
        description: event.description, 
        lat: event.lat, 
        long: event.long,
        date: event.date
      },
      this.jwtService.getHttpOptions()
    );
  }
}
