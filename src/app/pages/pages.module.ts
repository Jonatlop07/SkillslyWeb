import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AccountComponent } from './account/account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { RouterModule } from '@angular/router';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';

@NgModule({
  declarations: [PagesComponent, AccountComponent, PostsCreateComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CalendarModule,
    RouterModule,
  ],
})
export class PagesModule {}
