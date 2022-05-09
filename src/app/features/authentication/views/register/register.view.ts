import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/service/auth.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { RegisterForm } from '../../types/register_form.interface'
import { auth_routing_paths } from '../../auth.routing'

@Component({
  selector: 'skl-register',
  templateUrl: './register.view.html',
  styleUrls: ['./register.view.css'],
})
export class RegisterView implements OnInit {
  paths = auth_routing_paths;

  public form: FormGroup;
  public register_form: RegisterForm;
  public today = new Date();
  public form_submitted = false;

  constructor(
    private form_builder: FormBuilder,
    private auth_service: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.form = this.form_builder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
          ),
        ],
      ],
      date_of_birth: [this.today, [Validators.required]],
      accept_terms: [false, Validators.requiredTrue],
    });
  }

  public saveForm(): void {
    this.form_submitted = true;
    if (this.invalidForm()) {
      return;
    }
    this.register_form = this.form.value;
    this.register_form.date_of_birth = moment(
      this.form.get('date_of_birth').value
    ).format('DD/MM/YYYY');
    this.auth_service.registerUser(this.register_form).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (err) => {
        Swal.fire('Error', err.error.error, 'error');
      }
    );
  }

  public invalidInput(input: string): boolean {
    return this.form.get(input).invalid && this.form.get(input).touched;
  }

  public invalidForm(): boolean {
    return this.form.invalid && this.form_submitted;
  }
}
