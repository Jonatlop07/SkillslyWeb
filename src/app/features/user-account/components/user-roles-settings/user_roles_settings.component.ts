import { Component, OnInit, ViewChild } from '@angular/core'
import { showErrorPopup, showSuccessPopup } from '../../../../shared/pop-up/pop_up.utils'
import { Router } from '@angular/router'
import { AccountService } from '../../services/account.service'
import { StripeCardComponent, StripeService } from 'ngx-stripe'
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js'
import { Role } from '../../types/role.enum'
import { AuthService } from '../../../authentication/services/auth.service'

@Component({
  selector: 'skl-user-roles-settings',
  templateUrl: './user_roles_settings.component.html',
  styleUrls: ['./user_roles_settings.component.css']
})
export class UserRolesSettingsComponent implements OnInit {
  public roles: Array<string>;
  public is_investor: boolean;
  public is_requester: boolean;
  public obtain_investor_role = false;
  public obtain_requester_role = false;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  public constructor(
    private readonly auth_service: AuthService,
    private readonly account_service: AccountService,
    private readonly stripe_service: StripeService,
    private readonly router: Router
  ) {
  }

  public ngOnInit(): void {
    this.roles = this.account_service.getUserRoles();
    this.is_investor = this.roles.includes(Role.Investor);
    this.is_requester = this.roles.includes(Role.Requester);
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
          showSuccessPopup(
            'Has adquirido los roles exitosamente, te redigiremos a la seccion de inicio de sesión'
          )
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
          showErrorPopup(error_description);
        });
      } else if (result.error) {
        showErrorPopup('Error en el procesamiento del pago. Por favor, inténtalo de nuevo');
      }
    });
  }

  public getRoleName(role: string): string {
    if (role === Role.User) {
      return 'Usuario';
    }
    if (role === Role.Requester) {
      return 'Solicitante';
    }
    return 'Inversor';
  }

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
}
