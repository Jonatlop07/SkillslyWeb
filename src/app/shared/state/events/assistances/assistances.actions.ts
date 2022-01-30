import { EventCollectionModel } from "src/app/models/event_collection.model";

export class SetMyAssistances {
  static readonly type = '[Assistances Query] Set My Assistances';

  constructor(public readonly events: EventCollectionModel) {
  }
}

export class DeleteMyAssistance {
  static readonly type = '[Assistances Query] Delete My Assistance';

  constructor(public readonly event_id: string) {
  }
}
