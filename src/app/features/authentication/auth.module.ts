import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component'
import { ResetPasswordComponent } from './components/reset-password/reset-password.component'

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    PasswordRecoveryComponent,
    ResetPasswordComponent,
  ],
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
    DialogModule,
    FormsModule,
    CheckboxModule
  ]
})
export class AuthModule {}
