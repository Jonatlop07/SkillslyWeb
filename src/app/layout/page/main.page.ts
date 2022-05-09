import { OnInit, Component } from "@angular/core";
import { map } from "rxjs/operators";
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeService } from '../../core/service/theme.service'
import { themes } from '../../core/constants/themes'
import { Event, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router'

@Component({
  selector: 'skl-view',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.css']
})
export class MainPage implements OnInit {
  loading: boolean;

  current_theme: string;
  private overlay_container: OverlayContainer;

  constructor(
    private readonly theme_service: ThemeService,
    private readonly router: Router
  ) {
    this.loading = false;

    router.events.subscribe((event: Event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loading = false;
      }
    });
  }

  current_active_theme$ = this.theme_service.getDarkTheme().pipe(
    map((is_dark_theme: boolean) => {
      const [light_theme, dark_theme] = themes;
      this.current_theme = is_dark_theme ? light_theme.name : dark_theme.name;
      if (this.overlay_container) {
        const overlay_container_classes = this.overlay_container.getContainerElement()
          .classList;
        const theme_classes_to_remove = Array.from(
          overlay_container_classes
        ).filter((item: string) => item.includes('-theme'));
        if (theme_classes_to_remove.length) {
          overlay_container_classes.remove(...theme_classes_to_remove);
        }
        overlay_container_classes.add(this.current_theme);
      }
      return this.current_theme;
    })
  );

  ngOnInit(): void {
    if (this.overlay_container) {
      this.overlay_container
        .getContainerElement()
        .classList.add(this.current_theme);
    }
  }
}
