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
import {ImageModule} from 'primeng/image';
import {InputTextModule} from 'primeng/inputtext';

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
    ImageModule, 
    InputTextModule
  ],
  exports: [RegisterComponent],
})
export class AuthModule {}
