import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { Component } from '@angular/core'

@Component({
  selector: 'skl-reset-password',
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
