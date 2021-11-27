import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountForm } from '../../interfaces/account_form.interface';
import { GetAccountDataPresenter } from '../../interfaces/presenter/user/get_account_data.presenter'
import Swal from 'sweetalert2'
import * as moment from 'moment'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public form: FormGroup;
  public account_form: AccountForm;
  public change_password = false;
  public today = new Date();

  constructor(
    private readonly form_builder: FormBuilder,
    private readonly account_service: AccountService,
    private readonly auth_service: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAccountData();
  }

  getAccountData() {
    this.account_service
      .getUserAccountData()
      .subscribe((account_data: GetAccountDataPresenter) => {
        this.initForm(account_data);
      });
  }

  submitUserAccountData() {
    this.account_form = this.form.value;
    if (this.invalidForm()) {
      return this.getAccountData();
    }
    if (!this.account_form.password) {
      delete this.account_form.password;
    }
    this.account_form.date_of_birth = moment(
      this.form.get('date_of_birth').value
    ).format('DD/MM/YYYY');
    this.account_service
      .updateUserAccountData(this.account_form)
      .subscribe((account_data: GetAccountDataPresenter) => {
        this.initForm(account_data);
      });
  }

  deleteUserAccount() {
    this.account_service
      .deleteUserAccount()
      .subscribe(() => {
        this.auth_service.logout();
        this.router.navigate(['/login']);
      },
        (err) => {
          Swal.fire('Error', err.error.error, 'error');
        }
      );
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid;
  }

  initForm(form_data: GetAccountDataPresenter): void {
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

  onToggleChangePassword() {
    this.change_password = !this.change_password;
  }
}
