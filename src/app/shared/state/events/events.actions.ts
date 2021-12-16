import { EventsModel } from "src/app/models/events.model";

export class SetMyEvents {
  static readonly type = '[Events Query] Set My Events';

  constructor(public readonly events: EventsModel) {
  }
}

export class DeleteMyEvent {
  static readonly type = '[Events Query] Delete My Event';

  constructor(public readonly event_id: string) {
  }
}
