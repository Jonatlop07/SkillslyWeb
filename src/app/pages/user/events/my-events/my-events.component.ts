import { Component, OnInit } from '@angular/core';
import { EventModel } from 'src/app/models/events.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  public foundEvents: EventModel[];

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.foundEvents = this.eventService.getMyEvents();
  }

}
