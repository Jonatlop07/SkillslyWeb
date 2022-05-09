import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../../../core/service/auth.service'
import { Component } from '@angular/core'

@Component({
  selector: 'skl-reset-password',
  templateUrl: './reset_password.view.html',
  styleUrls: ['./reset_password.view.css'],
})
export class ResetPasswordView {
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
    this.activatedRoute.params.subscribe(({ token }) => {
      this.authService.resetPassword(this.password, token).subscribe(() => {
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
