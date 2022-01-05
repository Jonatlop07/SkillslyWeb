import { Injectable } from "@angular/core";
import {Action, State, StateContext, StateToken} from "@ngxs/store";
import { EventsModel } from "src/app/models/events.model";
import { DeleteMyAssistance, SetMyAssistances } from "./assistances.actions";

const ASSISTANCES_STATE_TOKEN = new StateToken<EventsModel>('my_assistance');

@Injectable({
  providedIn: 'root'
})
@State<EventsModel>({
  name: ASSISTANCES_STATE_TOKEN,
  defaults: {events: []}
})

export class AssistancesState{
  @Action(SetMyAssistances)
  public setMyAssistances(ctx: StateContext<EventsModel>, action: SetMyAssistances){
    ctx.setState({
      ...action.events
    });
  }

  @Action(DeleteMyAssistance)
  public deleteMyAssistance(ctx: StateContext<EventsModel>, action: DeleteMyAssistance){
    const state = ctx.getState();
    ctx.setState({
      events : state.events.filter( event => event.event_id !== action.event_id )
    });
  }

}