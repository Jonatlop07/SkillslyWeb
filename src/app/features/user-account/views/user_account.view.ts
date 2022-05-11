import { Component } from '@angular/core'
import AccountDataResponse from '../types/account_data.response'
import { AccountService } from '../services/account.service'
import { AccountDataPresenter } from '../types/account_data.presenter'
import { Subscription } from 'rxjs'

@Component({
  templateUrl: './user_account.view.html',
  styleUrls: ['./user_account.view.css']
})
export class UserAccountView {
  private user_account_data_subscription: Subscription;

  public user_account_details: AccountDataPresenter;

  constructor(
    private readonly account_service: AccountService,
  ) {}

  public ngOnInit(): void {
    this.getAccountData();
  }

  public getAccountData(): void {
    this.user_account_data_subscription = this.account_service
      .getUserAccountData()
      .subscribe(({ data }) => {
        this.user_account_details = data.user as AccountDataResponse;
      });
  }
}
