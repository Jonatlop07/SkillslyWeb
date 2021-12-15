import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsQueryComponent } from './groups-query.component';

describe('GroupsQueryComponent', () => {
  let component: GroupsQueryComponent;
  let fixture: ComponentFixture<GroupsQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
