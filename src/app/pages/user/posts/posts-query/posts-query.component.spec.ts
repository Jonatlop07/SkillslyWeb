import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsQueryComponent } from './posts-query.component';

describe('PostsQueryComponent', () => {
  let component: PostsQueryComponent;
  let fixture: ComponentFixture<PostsQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});