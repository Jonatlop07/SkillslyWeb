import { Component } from '@angular/core';
import { Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'skillsly_wa';

  loading: boolean;

  constructor(private router: Router) {
    this.loading = false;

    router.events.subscribe((event: Event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loading = false;
      }
    });
  }
}
