import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {requestResetPasswordInterface} from "../../interfaces/login/request_reset_password.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";


@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css'],
})
export class PasswordRecoveryComponent implements OnInit{
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
