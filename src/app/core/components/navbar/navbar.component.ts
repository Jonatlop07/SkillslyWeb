import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';
import UserNotification from '../../notification/types/user_notification';
import { NotificationModel } from '../../notification/model/notification.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from '../../notification/services/notification.service';
import { post_routing_paths } from '../../../features/post/post.routing';
import { service_request_routing_paths } from '../../../features/service-request/service_request.routing';
import { chat_routing_paths } from '../../../features/chat/chat.routing';
import { user_account_routing_paths } from '../../../features/user-account/user_account.routing';
import { social_routing_paths } from '../../../features/social/social.routing';
import { auth_routing_paths } from '../../../features/authentication/auth.routing';
import { feed_routing_paths } from '../../../features/feed/feed.routing';

@Component({
  selector: 'skl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  paths = {
    feed: feed_routing_paths,
    post: post_routing_paths,
    service_request: service_request_routing_paths,
    chat: chat_routing_paths,
    user_account: user_account_routing_paths,
    social: social_routing_paths,
  };

  public searchForm = false;

  private unsubscribe = new Subject<void>();

  public notifications: Array<NotificationModel>;

  constructor(
    private readonly authService: AuthService,
    private readonly notification_service: NotificationService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService
  ) {}

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
      .subscribe((notification: UserNotification) => {
        console.log(notification);
        if (notification.action_details) {
          this.notification_service
            .storeNotification({
              data: notification.data,
              action_details: notification.action_details,
            })
            .subscribe(() => {
              this.toastr.info(
                notification.action_details.message,
                'Nueva notificacion'
              );
            });
        }
      });
  }

  ngOnDestroy() {
    this.notification_service.leave();
  }

  logout() {
    this.authService.logout();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.notification_service.leave();
    this.router.navigate([
      `${auth_routing_paths.auth}/${auth_routing_paths.sign_in}`,
    ]);
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
    this.router.navigate(['./social/search', searchInput], {
      relativeTo: this.activatedRoute,
    });
  }
  searchPost() {
    this.router.navigate([`${post_routing_paths.posts}`, this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
  searchProject() {
    this.router.navigate(['./projects-query', this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
}
