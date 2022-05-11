import { Component } from "@angular/core";
import { Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router'

@Component({
  selector: 'skl-auth-view',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.css']
})
export class AuthPage {
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
