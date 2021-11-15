import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterForm } from '../../interfaces/register_form.interface';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public form: FormGroup;
  public register_form: RegisterForm;
  public today = new Date();
  public form_submitted = false;

  constructor(
    private form_builder: FormBuilder,
    private auth_service: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm(): void {
    this.form = this.form_builder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      email: ['', [
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
      date_of_birth: ['01/01/2000', [
        Validators.required,
        Validators.pattern(
          /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
        )
      ]]
    });
  }

  saveForm() {
    this.form_submitted = true;
    if (this.invalidForm()) {
      return;
    }
    this.register_form = this.form.value;
    this.register_form.date_of_birth = moment(
      this.form.get('date_of_birth').value
    ).format('DD/MM/YYYY');
    const registerResponse = this.auth_service.registerUser(this.register_form);
    registerResponse.subscribe(() => {
      this.router.navigate(['/login']);
    }, (err) => {
      Swal.fire('Error', err.error.error, 'error' );
    });
  }

  invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  invalidForm(): boolean {
    return this.form.invalid && this.form_submitted;
  }
}