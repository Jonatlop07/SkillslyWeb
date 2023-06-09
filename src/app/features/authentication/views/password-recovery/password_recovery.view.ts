import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../../../core/service/auth.service'
import { Router } from '@angular/router'
import { requestResetPasswordInterface } from '../../types/request_reset_password.interface'

@Component({
  selector: 'skl-password-recovery',
  templateUrl: './password_recovery.component.html',
  styleUrls: ['./password_recovery.view.css'],
})
export class PasswordRecoveryView implements OnInit{
  public form: FormGroup;
  public token: string;
  public requestResetPassword: requestResetPasswordInterface;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {

  }
  saveForm(): void {
    this.requestResetPassword = this.form.value;
    this.authService.requestResetPassword(this.requestResetPassword).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [' ', [Validators.required ]]
    });
  }
}
