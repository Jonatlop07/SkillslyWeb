
export interface EventsModel {
  events: Array<EventModel>
}
export interface EventModel {
  user_id: string;
  event_id: string;
  name: string;
  description: string;
  lat: number;
  long: number; 
  date: Date;
  created_at: string;
}
