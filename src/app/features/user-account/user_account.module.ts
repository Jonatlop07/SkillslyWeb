import { NgModule } from '@angular/core'
import { UserAccountView } from './views/user_account.view'
import { UserAccountRoutingModule } from './user_account.routing'
import { AccountDetailsComponent } from './components/account-details/account_details.component'
import { TwoFactorAuthSettingsComponent } from './components/two-factor-auth-settings/two_factor_auth_settings.component'
import { UserRolesSettingsComponent } from './components/user-roles-settings/user_roles_settings.component'
import { NgxStripeModule } from 'ngx-stripe'
import { AccountService } from './services/account.service'
import { UserDataService } from './services/user_data.service'
import { DialogModule } from 'primeng/dialog'
import { CalendarModule } from 'primeng/calendar'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [
    UserAccountView,
    AccountDetailsComponent,
    UserRolesSettingsComponent,
    TwoFactorAuthSettingsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    CalendarModule,
    DialogModule,
    NgxStripeModule.forChild(
      'pk_test_51KKqzTLW8alQ67QMS4GSfh6VTdVVvJH3LFlptoBZQW6yZhoB516uFllbjcmtvDUsuedzrcU12wAbnELdm5b10e6700wWxK7ASu'
    ),
    UserAccountRoutingModule
  ],
  providers: [
    AccountService,
    UserDataService
  ],
})
export class UserAccountModule {
}
