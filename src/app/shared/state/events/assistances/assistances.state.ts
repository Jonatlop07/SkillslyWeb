import { Injectable } from "@angular/core";
import {Action, State, StateContext, StateToken} from "@ngxs/store";
import { EventCollectionModel } from "src/app/models/event_collection.model";
import { DeleteMyAssistance, SetMyAssistances } from "./assistances.actions";

const ASSISTANCES_STATE_TOKEN = new StateToken<EventCollectionModel>('my_assistance');

@Injectable({
  providedIn: 'root'
})
@State<EventCollectionModel>({
  name: ASSISTANCES_STATE_TOKEN,
  defaults: {events: []}
})

export class AssistancesState{
  @Action(SetMyAssistances)
  public setMyAssistances(ctx: StateContext<EventCollectionModel>, action: SetMyAssistances){
    ctx.setState({
      ...action.events
    });
  }

  @Action(DeleteMyAssistance)
  public deleteMyAssistance(ctx: StateContext<EventCollectionModel>, action: DeleteMyAssistance){
    const state = ctx.getState();
    ctx.setState({
      events : state.events.filter( event => event.event_id !== action.event_id )
    });
  }

}
