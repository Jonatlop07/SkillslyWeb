import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../../../features/authentication/services/auth.service'
import UserNotification from '../../../features/notification/types/user_notification'
import { NotificationModel } from '../../../features/notification/model/notification.model'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { NotificationService } from '../../../features/notification/services/notification.service'

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
    private readonly notification_service: NotificationService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService
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
          if (notification.action_details) {
            this.notification_service.storeNotification({
              data: notification.data,
              action_details: notification.action_details
            }).subscribe(() => {
              this.toastr.info(notification.action_details.message, 'Nueva notificacion');
            });
          }
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
  searchProject() {
    this.router.navigate(['./projects-query', this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
}
