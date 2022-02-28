import { Component, Input, OnInit } from '@angular/core'
import { showErrorPopup, showSuccessPopup } from '../../../../shared/pop-up/pop_up.utils'
import { AccountDataPresenter } from '../../types/account_data.presenter'
import { FormBuilder } from '@angular/forms'
import { AccountService } from '../../services/account.service'
import { LoginResponse } from '../../../../interfaces/login/login_response.interface'
import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'skl-two-factor-auth-settings',
  templateUrl: './two_factor_auth_settings.component.html',
  styleUrls: ['./two_factor_auth_settings.component.css']
})
export class TwoFactorAuthSettingsComponent implements OnInit {
  @Input('data')
  public user_account_details: AccountDataPresenter;

  public is_two_factor_auth_enabled: boolean = false;
  public displaying_two_factor_auth_modal: boolean = false;
  public qr_code: any;
  public authentication_code: string;

  public constructor(
    private readonly form_builder: FormBuilder,
    private readonly account_service: AccountService,
    private readonly auth_service: AuthService,
  ) {
  }

  public ngOnInit(): void {}

  public validateQRCode() {
    this.displaying_two_factor_auth_modal = true;
  }

  public generateQRCode() {
    this.account_service.generateAuthQRCode()
      .subscribe((QRCode: Blob) => {
        this.is_two_factor_auth_enabled = true;
        this.createImageFromBlob(QRCode);
      }, (err) => {
        showErrorPopup(err.error.error);
      });
  }

  public enableTwoFactorAuthentication() {
    this.auth_service
      .turnOnQRCode(this.authentication_code)
      .subscribe(() => {
        this.auth_service
          .authenticateTwoFactor(this.authentication_code)
          .subscribe(
            (result: LoginResponse) => {
              this.displaying_two_factor_auth_modal = false;
              this.authenticate(result);
              showSuccessPopup(
                'El codigo que ingresaste es válido. Ya puedes usar Google Authenticator para iniciar sesión'
              );
            },
            this.displayErrorEnablingTwoFactorAuthentication
          );
      }, this.displayErrorEnablingTwoFactorAuthentication);

  }

  private displayErrorEnablingTwoFactorAuthentication(err: any) {
    this.displaying_two_factor_auth_modal = false;
    showErrorPopup(err.error.error);
  }

  public disableTwoFactorAuthentication() {
    this.account_service
      .updateUserAccountData({
        ...this.user_account_details,
        is_two_factor_auth_enabled: false
      })
      .subscribe((account_data: AccountDataPresenter) => {
        this.is_two_factor_auth_enabled = account_data.is_two_factor_auth_enabled;
        this.qr_code = null;
      });
  }

  private authenticate(result: LoginResponse) {
    const { id, customer_id, email, roles, access_token } = result;
    const now = new Date();
    now.setSeconds(7200);
    this.auth_service
      .setSessionData({
        user_id: id,
        customer_id,
        user_email: email,
        user_roles: roles,
        access_token,
        expires_date: now.getTime().toString(),
        is_two_factor_auth_enabled: result.is_two_factor_auth_enabled
      })
      .subscribe(() => {});
  }

  private createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.qr_code = reader.result;
    });
    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
