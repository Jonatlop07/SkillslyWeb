import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';
import { CreateEventPresenter } from '../interfaces/presenter/event/create_event.presenter';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { EventsState } from '../shared/state/events/events.state';
import { AssistancesState } from '../shared/state/events/assistances/assistances.state';
import { EventModel, EventsModel } from '../models/events.model';
import { SetMyEvents } from '../shared/state/events/events.actions';
import { tap } from 'rxjs/operators';
import { SetMyAssistances } from '../shared/state/events/assistances/assistances.actions';
import { CreateAssistancePresenter } from '../interfaces/presenter/event/assistance/create_assistance.presenter';
import { DeleteAssistancePresenter } from '../interfaces/presenter/event/assistance/delete_assistance.presenter';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  @Select(EventsState) events$: Observable<EventsModel>;
  @Select(AssistancesState) assistance$: Observable<EventsModel>;

  
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
      events = e.events;
    });
    return events;
  }
   
  private storeMyEvents(events: Array<EventModel>): Observable<void> {
    return this.store.dispatch(new SetMyEvents({events}));
  }

  public deleteEvent(event_id : string) {
    return this.http.delete(
      `${this.API_URL}/event/${event_id}`,
      this.jwt_service.getHttpOptions()
    );
  }

  public updateEvent(event: CreateEventPresenter, event_id : string) {
    return this.http.put(
      `${this.API_URL}/event/${event_id}`,
      event,
      this.jwt_service.getHttpOptions()
    );
  }

  public createAssistance(assistance: CreateAssistancePresenter) {
    return this.http.post(
      `${this.API_URL}/event/assistant/${assistance.event_id}}`,
      {},
      this.jwt_service.getHttpOptions()
    );
  }

  public deleteAssistance(assistance: DeleteAssistancePresenter) {
    return this.http.post(
      `${this.API_URL}/event/assistant`,
      assistance,
      this.jwt_service.getHttpOptions(), 
    );
  }

  public getAndStoreMyAssistancesCollection() {
    this.http.get(
      `${this.API_URL}/event/assistant/my-assistant/${this.jwt_service.getUserId()}`,
      this.jwt_service.getHttpOptions()
    )
    .subscribe((my_assistance_collection: any) => {
      this.storeMyAssistances(my_assistance_collection.events)
    });
  }

  public getMyAssistances() {
    let assistances: Array<EventModel> = [];
    this.assistance$.subscribe(e => {
      assistances = e.events;
    });
    return assistances;
  }
   
  private storeMyAssistances(events: Array<EventModel>): Observable<void> {
    return this.store.dispatch(new SetMyAssistances({events}));
  }
}