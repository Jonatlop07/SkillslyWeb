import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserNotificationsService } from '../../../services/user_notifications.service'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Store } from '@ngxs/store'
import { AppendGroupConversation } from '../../state/conversations/conversations.actions'
import { ConversationPresenter } from '../../../interfaces/presenter/chat/conversation.presenter'
import { User } from '../../../interfaces/user.interface'
import {
  AppendReceivedFollowRequest,
  DeleteSentFollowRequest
} from '../../state/follow_requests/follow_requests.actions'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public searchForm = false;

  private unsubscribe = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly notification_service: UserNotificationsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store
  ) { }

  ngOnInit() {
    this.notification_service.join();
    this.notification_service.
      onFollowRequestReceived()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((follow_request: User) => {
        this.store.dispatch(new AppendReceivedFollowRequest(follow_request));
      })
    this.notification_service.
      onFollowRequestAccepted()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((follow_request: User) => {
        this.store.dispatch(new DeleteSentFollowRequest(follow_request));
      });
    this.notification_service.
      onFollowRequestDeleted()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((follow_request: User) => {
        this.store.dispatch(new DeleteSentFollowRequest(follow_request));
      });
    this.notification_service
      .onAddedToNewGroupConversation()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((new_group_conversation: ConversationPresenter) => {
        this.store.dispatch(new AppendGroupConversation(new_group_conversation));
      });
  }

  ngOnDestroy() {
    this.notification_service.leave();
  }

  logout(){
    this.authService.logout();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.notification_service.leave();
    this.router.navigate(['/login']);
  }

  showSearchForm(){
    if (!this.searchForm) {
      this.searchForm = true;
    } else {
      this.searchForm = false;
    }
  }

  searchUser(searchInput: string){
    searchInput = searchInput.trim();
    if (!searchInput){
      this.searchForm = false;
      return;
    }
    this.router.navigate(['./search', searchInput], {relativeTo: this.activatedRoute });
  }
  searchPost(){
    this.router.navigate(['./query', this.authService.getUserId()], {relativeTo: this.activatedRoute });
  }

}

