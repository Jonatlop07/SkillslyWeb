import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as moment from 'moment'
import AccountDataResponse from '../../types/account_data.response'
import { showErrorPopup, showSuccessPopup } from '../../../../shared/pop-up/pop_up.utils'
import { UpdateSessionEmail } from '../../../../shared/state/session/session.actions'
import { AccountFormDetails } from '../../types/account_form_details.interface'
import { AccountDataPresenter } from '../../types/account_data.presenter'
import { AccountService } from '../../services/account.service'
import { Store } from '@ngxs/store'
import { Router } from '@angular/router'
import { AuthService } from '../../../../core/service/auth.service'

@Component({
  selector: 'skl-account-details',
  templateUrl: './account_details.component.html',
  styleUrls: ['./account_details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  @Input('data')
  public user_account_details: AccountDataPresenter;

  public form: FormGroup;
  public account_form: AccountFormDetails
  public changing_password = false;
  public today = new Date();

  public constructor(
    private readonly form_builder: FormBuilder,
    private readonly account_service: AccountService,
    private readonly auth_service: AuthService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm(this.user_account_details)
  }

  public onToggleChangePassword(): void {
    this.changing_password = !this.changing_password;
  }

  public submitUserAccountData(): void {
    this.account_form = this.form.value;
    if (this.invalidForm()) {
      return;
    }
    if (!this.account_form.password) {
      delete this.account_form.password;
    }
    this.account_form.date_of_birth = moment(
      this.form.get('date_of_birth').value
    ).format('DD/MM/YYYY');
    this.account_service
      .updateUserAccountData({
        ...this.account_form,
        is_two_factor_auth_enabled: this.user_account_details.is_two_factor_auth_enabled
      })
      .subscribe(async (account_data: AccountDataResponse) => {
        await showSuccessPopup('Has actualizado tu cuenta exitosamente');
        this.user_account_details = account_data;
        this.initForm(account_data);
        this.store.dispatch(new UpdateSessionEmail(account_data.email));
      }, (err) => {
        const { error, message } = err.error
        const error_description = message ?
          'Ocurrió un error al actualizar tus datos'
          : error;
        showErrorPopup(error_description);
      });
  }

  public deleteUserAccount(): void {
    this.account_service
      .deleteUserAccount()
      .subscribe(() => {
          this.auth_service.logout();
          this.router.navigate(['/login']);
        },
        (err) => {
          showErrorPopup(err.error.error);
        }
      );
  }

  public initForm(form_data: AccountDataPresenter): void {
    this.form = this.form_builder.group({
      name: [form_data.name, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      email: [form_data.email, [
        Validators.required,
        Validators.pattern(
          /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
        )
      ]],
      password: ['', [
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
        )
      ]],
      date_of_birth: [form_data.date_of_birth, [
        Validators.required,
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
        )
      ]]
    });
  }

  public invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  public invalidForm(): boolean {
    return this.form.invalid;
  }
}
