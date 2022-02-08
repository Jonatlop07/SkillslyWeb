import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {resetPasswordInterface} from "../../interfaces/login/reset_password.interface";


@Component({
  selector: 'app-resetPassword',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  public form: FormGroup;
  public resetPassword: resetPasswordInterface;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
  ) {

  }
  saveForm(): void {
    this.resetPassword = this.form.value;
    this.activatedRoute.params.subscribe(params => {
      this.resetPassword.token = params.token;
      this.authService.resetPassword(this.resetPassword).subscribe(() => {
        this.router.navigate(['/login']);
      });
    });

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [' ', [Validators.required ]]
    });
  }
}
