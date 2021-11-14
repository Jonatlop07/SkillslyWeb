import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { ButtonModule } from 'primeng/button';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CreateProfileComponent],
  imports: [
    CommonModule,
    ChipsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
  ],
})
export class ProfileModule {}
