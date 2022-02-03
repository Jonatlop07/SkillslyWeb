import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordModule } from 'primeng/password';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component'
import { RouterModule } from '@angular/router';
import { AccountService } from '../services/account.service';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import {ImageModule} from 'primeng/image';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {MessageModule} from "primeng/message";
import { DialogModule } from 'primeng/dialog'

@NgModule({
  declarations: [RegisterComponent, LoginComponent, PasswordRecoveryComponent],
  providers: [AccountService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CalendarModule,
    PasswordModule,
    RouterModule,
    ImageModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    DialogModule,
    FormsModule
  ],
  exports: [RegisterComponent],
})
export class AuthModule {}
