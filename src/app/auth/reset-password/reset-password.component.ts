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
  public password: string;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
  ) {

  }
  saveForm(): void {
    this.password = this.form.value.password;
    this.activatedRoute.params.subscribe(params => {
      this.authService.resetPassword(this.password, params.token).subscribe(() => {
        this.router.navigate(['/login']);
      });
    });

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: [' ', [Validators.required ]]
    });
  }
}
