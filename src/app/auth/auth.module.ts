import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from '../auth/register/register.component';



@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    CalendarModule,
  ],
  exports:[RegisterComponent]
})
export class AuthModule { }
