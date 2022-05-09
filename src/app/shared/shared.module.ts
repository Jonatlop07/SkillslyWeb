import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule
  ]
})
export class SharedModule {}
