import {Action, State, StateContext, StateToken} from "@ngxs/store";
import { EventsModel } from "src/app/models/events.model";
import { DeleteMyEvent, SetMyEvents } from "./events.actions";

const EVENTS_STATE_TOKEN = new StateToken<EventsModel>('my_post');

@State<EventsModel>({
  name: EVENTS_STATE_TOKEN,
  defaults: {events: []}
})

export class MyEventsState{
  @Action(SetMyEvents)
  public setMyEvents(ctx: StateContext<EventsModel>, action: SetMyEvents){
    ctx.setState({
      ...action.events
    });
  }

  @Action(DeleteMyEvent)
  public deleteMyPost(ctx: StateContext<EventsModel>, action: DeleteMyEvent){
    const state = ctx.getState();
    ctx.setState({
      events : state.events.filter( event => event.event_id !== action.event_id )
    });
  }

}