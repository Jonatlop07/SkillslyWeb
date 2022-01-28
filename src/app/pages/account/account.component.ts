import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountFormDetails } from '../../interfaces/user-account/account_form_details.interface';
import { AccountDataPresenter } from '../../interfaces/user-account/account_data.presenter';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngxs/store';
import { UpdateSessionEmail } from '../../shared/state/session/session.actions';
import { Role } from '../../interfaces/user-account/role.enum';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public form: FormGroup;
  public account_form: AccountFormDetails;
  public change_password = false;
  public today = new Date();

  public roles: Array<string>;

  public is_investor: boolean;
  public is_requester: boolean;

  public obtain_investor_role: boolean = false;
  public obtain_requester_role: boolean = false;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '400',
        fontFamily: '"Poppins", sans-serif',
        fontSize: '15px',
        '::placeholder': {
          color: '#b1c2d7',
        },
      },
    },
  };

  public elementsOptions: StripeElementsOptions = {
    locale: 'auto',
  };

  constructor(
    private readonly form_builder: FormBuilder,
    private readonly account_service: AccountService,
    private readonly auth_service: AuthService,
    private readonly stripe_service: StripeService,
    private readonly store: Store,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.getAccountData();
    this.roles = this.account_service.getUserRoles();
    this.is_investor = this.roles.includes(Role.Investor);
    this.is_requester = this.roles.includes(Role.Requester);
  }

  public getAccountData(): void {
    this.account_service
      .getUserAccountData()
      .subscribe((account_data: AccountDataPresenter) => {
        this.initForm(account_data);
      });
  }

  public submitUserAccountData(): void {
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
      .subscribe((account_data: AccountDataPresenter) => {
        this.initForm(account_data);
        this.store.dispatch(new UpdateSessionEmail(account_data.email));
      });
  }

  public onChangeObtainRequesterRoleCheckbox(): void {
    this.obtain_requester_role = !this.obtain_requester_role;
  }

  public onChangeObtainInvestorRoleCheckbox(): void {
    this.obtain_investor_role = !this.obtain_investor_role;
  }

  public obtainSpecialRoles(): void {
    this.stripe_service.createPaymentMethod({
      type: 'card',
      card: this.card.element
    }).subscribe((result) => {
      if (result.paymentMethod) {
        this.account_service.obtainSpecialRoles({
          obtain_requester_role: this.obtain_requester_role,
          obtain_investor_role: this.obtain_investor_role,
          payment_method_id: result.paymentMethod.id
        }).subscribe(() => {
          Swal.fire({
            customClass: {
              container: 'my-swal'
            },
            title: 'Éxito',
            text: 'Has adquirido los roles exitosamente, te redigiremos a la seccion de inicio de sesión',
            icon: 'success'
          });
          this.auth_service
            .logout()
            .subscribe(() => {
              this.router.navigate(['../login']);
            });
        }, (err) => {
          const { error, message } = err.error
          const error_description = message ?
            'Ocurrió un error. Por favor, asegúrate de haber elegido un rol'
            : error;
          Swal.fire(
            'Error',
            error_description,
            'error'
          );
        });
      } else if (result.error) {
        Swal.fire(
          'Error',
          'Error en el procesamiento del pago. Por favor, inténtalo de nuevo',
          'error'
        );
      }
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
          Swal.fire('Error', err.error.error, 'error');
        }
      );
  }

  public invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  public invalidForm(): boolean {
    return this.form.invalid;
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

  public onToggleChangePassword(): void {
    this.change_password = !this.change_password;
  }

  public getRoleName(role: string): string {
    if (role === Role.User)
      return 'Usuario';
    if (role === Role.Requester)
      return 'Solicitante';
    return 'Inversor';
  }
}
