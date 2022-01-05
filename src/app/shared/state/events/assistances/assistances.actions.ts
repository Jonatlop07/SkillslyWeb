import { EventsModel } from "src/app/models/events.model";

export class SetMyAssistances {
  static readonly type = '[Assistances Query] Set My Assistances';

  constructor(public readonly events: EventsModel) {
  }
}

export class DeleteMyAssistance {
  static readonly type = '[Assistances Query] Delete My Assistance';

  constructor(public readonly event_id: string) {
  }
}
