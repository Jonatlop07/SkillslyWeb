import { EventCollectionModel } from "src/app/models/event_collection.model";

export class SetMyEvents {
  static readonly type = '[Events Query] Set My Events';

  constructor(public readonly events: EventCollectionModel) {
  }
}

export class DeleteMyEvent {
  static readonly type = '[Events Query] Delete My Event';

  constructor(public readonly event_id: string) {
  }
}
