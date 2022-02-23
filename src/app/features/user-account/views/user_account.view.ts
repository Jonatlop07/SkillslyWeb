import { Component } from '@angular/core'
import AccountDataResponse from '../types/account_data.response'
import { AccountService } from '../services/account.service'
import { AccountDataPresenter } from '../types/account_data.presenter'

@Component({
  templateUrl: './user_account.view.html',
  styleUrls: ['./user_account.view.css']
})
export class UserAccountView {
  public user_account_details: AccountDataPresenter;

  constructor(
    private readonly account_service: AccountService,
  ) {}

  public ngOnInit(): void {
    this.getAccountData();
  }

  public getAccountData(): void {
    this.account_service
      .getUserAccountData()
      .subscribe((account_data: AccountDataResponse) => {
        this.user_account_details = account_data;
      });
  }
}
