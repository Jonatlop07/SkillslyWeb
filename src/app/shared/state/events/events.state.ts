import { Injectable } from "@angular/core";
import {Action, State, StateContext, StateToken} from "@ngxs/store";
import { EventCollectionModel } from "src/app/models/event_collection.model";
import { DeleteMyEvent, SetMyEvents } from "./events.actions";

const EVENTS_STATE_TOKEN = new StateToken<EventCollectionModel>('my_event');

@Injectable({
  providedIn: 'root'
})
@State<EventCollectionModel>({
  name: EVENTS_STATE_TOKEN,
  defaults: {events: []}
})

export class EventsState{
  @Action(SetMyEvents)
  public setMyEvents(ctx: StateContext<EventCollectionModel>, action: SetMyEvents){
    ctx.setState({
      ...action.events
    });
  }

  @Action(DeleteMyEvent)
  public deleteMyEvent(ctx: StateContext<EventCollectionModel>, action: DeleteMyEvent){
    const state = ctx.getState();
    ctx.setState({
      events : state.events.filter( event => event.event_id !== action.event_id )
    });
  }

}
