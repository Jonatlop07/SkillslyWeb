import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../../service/auth.service'
import { NotificationModel } from '../../notification/model/notification.model'
import { Subject } from 'rxjs'
import { post_routing_paths } from '../../../features/post/post.routing'
import { service_request_routing_paths } from '../../../features/service-request/service_request.routing'
import { chat_routing_paths } from '../../../features/chat/chat.routing'
import { user_account_routing_paths } from '../../../features/user-account/user_account.routing'
import { social_routing_paths } from '../../../features/social/social.routing'
import { auth_routing_paths } from '../../../features/authentication/auth.routing'
import { feed_routing_paths } from '../../../features/feed/feed.routing'
import { lalu_routing_paths } from '../../../features/lalu/lalu.routing'
// import { NotificationService } from '../../notification/services/notification.service'
/* import { takeUntil } from 'rxjs/operators'
import UserNotification from '../../notification/types/user_notification' */

@Component({
  selector: 'skl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  paths = {
    feed: feed_routing_paths,
    post: post_routing_paths,
    service_request: service_request_routing_paths,
    chat: chat_routing_paths,
    user_account: user_account_routing_paths,
    social: social_routing_paths,
    lalu: lalu_routing_paths
  };

  public searchForm = false;

  private unsubscribe = new Subject<void>();

  public notifications: Array<NotificationModel>;

  constructor(
    private readonly authService: AuthService,
    //private readonly notification_service: NotificationService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService
  ) {
  }

  ngOnInit() {
    /*this.notification_service.join();
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
      );*/
  }

  logout() {
    this.authService.logout();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.router.navigate([`${auth_routing_paths.auth}/${auth_routing_paths.sign_in}`]);
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
    this.router.navigate([`${post_routing_paths.posts}/user`, this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
  searchProject() {
    this.router.navigate(['./projects-query', this.authService.getUserId()], {
      relativeTo: this.activatedRoute,
    });
  }
}
