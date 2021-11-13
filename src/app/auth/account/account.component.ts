import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountForm } from '../../interfaces/account_form.interface';
import Swal from 'sweetalert2'
import { GetAccountDataPresenter } from '../../interfaces/presenter/get_account_data.presenter'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public form: FormGroup;
  public account_form: AccountForm;

  constructor(
    private readonly form_builder: FormBuilder,
    private readonly account_service: AccountService
  ) {
  }

  ngOnInit(): void {
    this.account_service
      .getUserAccountData(localStorage.getItem('id'))
      .subscribe((account_data: GetAccountDataPresenter) => {
        this.initForm(account_data);
      });
  }

  submitUserAccountData() {
    this.account_form = this.form.value;
  }

  private invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  private invalidForm(): boolean {
    return this.form.invalid;
  }

  initForm(form_data: GetAccountDataPresenter): void {
    this.form = this.form_builder.group({
      name: [form_data.name || '', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      email: [form_data.email || '', [
        Validators.required,
        Validators.pattern(
          /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
        )
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
        )
      ]],
      date_of_birth: [form_data.date_of_birth || '', [
        Validators.required,
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
        )
      ]]
    });
  }
}
