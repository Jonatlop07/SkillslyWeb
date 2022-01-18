import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserNotificationsService } from '../../../services/user_notifications.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import UserNotification from '../../../interfaces/notifications/user_notification'
import { NotificationModel } from '../../../models/notification.model'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  public searchForm = false;

  private unsubscribe = new Subject<void>();

  public notifications: Array<NotificationModel>;

  constructor(
    private readonly authService: AuthService,
    private readonly notification_service: UserNotificationsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.notification_service
      .getNotificationsFromStore()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((notification_collection) => {
        this.notifications = notification_collection.notifications;
      });
    this.notification_service.join();
    this.notification_service
      .onNotificationArrives()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (notification: UserNotification) => {
          console.log(notification)
          if (notification.action_details)
            this.notification_service.storeNotification({
              data: notification.data,
              action_details: notification.action_details
            });
        }
      );
  }

  ngOnDestroy() {
    this.notification_service.leave();
  }

  logout() {
    this.authService.logout();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.notification_service.leave();
    this.router.navigate(['/login']);
  }

  showSearchForm() {
    if (!this.searchForm) {
      this.searchForm = true;
    } else {
      this.searchForm = false;
    }
  }

  searchUser(searchInput: string) {
    searchInput = searchInput.trim();
    if (!searchInput) {
      this.searchForm = false;
      return;
    }
    this.router.navigate(['./search', searchInput], {
      relativeTo: this.activatedRoute,
    });
  }
  searchPost() {
    this.router.navigate(['./query', this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
}
