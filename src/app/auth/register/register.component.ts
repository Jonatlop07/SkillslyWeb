import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { RegisterForm } from '../../interfaces/register_form.interface';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  public form: FormGroup; 
  public registerForm: RegisterForm;
  public today = new Date();
  public formSubmitted = false; 

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern(/^[_A-Za-z0-9-\\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)]],
      date_of_birth: ['', [Validators.required]],
    });
  }

  saveForm(){
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.registerForm = this.form.value;
    const selectedDate: Date = this.form.get('date_of_birth').value;
    if (selectedDate.getMonth() < 9) {
      if (selectedDate.getDate() < 9) {
        this.registerForm.date_of_birth = `0${selectedDate.getDate()}/0${selectedDate.getMonth()+1}/${selectedDate.getFullYear()}`;
      } else {
        this.registerForm.date_of_birth = `${selectedDate.getDate()}/0${selectedDate.getMonth()+1}/${selectedDate.getFullYear()}`;
      }
    } else {
      if (selectedDate.getDate() < 9) {
        this.registerForm.date_of_birth = `0${selectedDate.getDate()}/${selectedDate.getMonth()+1}/${selectedDate.getFullYear()}`;
      } else {
        this.registerForm.date_of_birth = `${selectedDate.getDate()}/${selectedDate.getMonth()+1}/${selectedDate.getFullYear()}`;
      }
    }
    const registerResponse =  this.authService.registerUser(this.registerForm);
    registerResponse.subscribe(() => { 
      this.router.navigate(['/login']); 
    }, (err) => {
      Swal.fire('Error', err.error.error, 'error' );
    }); 
  }

  invalidInput( input: string ): boolean {
    if ( this.form.get(input).invalid && this.form.get(input).touched) {
      return true;
    } else {
      return false;
    }
  }

  invalidForm(): boolean {
    if ( this.form.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false; 
    }
  }

}
