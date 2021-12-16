import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { CreateEventPresenter } from '../interfaces/presenter/event/create_event.presenter';
import { Select, Store } from '@ngxs/store';
import { SessionState } from '../shared/state/session/session.state';
import { Observable, of } from 'rxjs';
import { SessionModel } from '../models/session.model';
import { EventsState } from '../shared/state/events/events.state';
import { EventModel, EventsModel } from '../models/events.model';
import { SetMyEvents } from '../shared/state/events/events.actions';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  @Select(EventsState) events$: Observable<EventsModel>;
  
  private readonly API_URL: string = environment.API_URL;
  public isChargingFeedEvents = false;

  constructor(
    private readonly http: HttpClient,
    private readonly jwt_service: JwtService, 
    private readonly store: Store
  ) { }

  public createEvent(event:CreateEventPresenter) {
    return this.http.post(
      `${this.API_URL}/event`,
      {
        name: event.name, 
        description: event.description, 
        lat: event.lat, 
        long: event.long,
        date: event.date
      },
      this.jwt_service.getHttpOptions()
    );
  }

  public getEventsOfFriendsCollection(limit: number,offset: number) {
    if (this.isChargingFeedEvents) {
      return of([]);
    }
    let params  = new HttpParams();
    params = params.append('limit', limit);
    params = params.append('offset', offset);
    this.isChargingFeedEvents = true; 
    return this.http.get(
      `${this.API_URL}/event`,
      {
        params,
        ...this.jwt_service.getHttpOptions(),
      }
    ).pipe(
      tap(() => {
        this.isChargingFeedEvents = false; 
      })
    )
  }

  public getMyEventsCollection() {
    return this.http.get(
      `${this.API_URL}/event/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public getAndStoreMyEventsCollection() {
    this.http.get(
      `${this.API_URL}/event/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    )
    .subscribe((my_event_collection: any) => {
      this.storeMyEvents(my_event_collection.events)
    });
  }

  public getMyEvents() {
    let events: Array<EventModel> = [];
    this.events$.subscribe(e => {
      console.log(e)
      events = e.events;
    });
    return events;
  }
   
  private storeMyEvents(events: Array<EventModel>): Observable<void> {
    return this.store.dispatch(new SetMyEvents({events}));
  }

}