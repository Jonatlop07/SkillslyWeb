import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, RouterModule, InputTextModule],
  exports: [NavbarComponent],
})
export class SharedModule {}
