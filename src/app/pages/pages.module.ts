import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { PostsCreateComponent } from './user/posts/posts-create/posts-create.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PagesComponent, PostsCreateComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class PagesModule {}
