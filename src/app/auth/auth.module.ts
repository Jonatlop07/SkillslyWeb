import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import {ImageModule} from 'primeng/image';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';

@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  providers: [AccountService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    PasswordModule,
    RouterModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ImageModule, 
    InputTextModule, 
    ButtonModule, 
    DividerModule
  ],
  exports: [RegisterComponent],
})
export class AuthModule {}
