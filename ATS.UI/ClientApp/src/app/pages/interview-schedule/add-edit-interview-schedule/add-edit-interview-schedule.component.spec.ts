import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInterviewScheduleComponent } from './add-edit-interview-schedule.component';

describe('AddEditInterviewScheduleComponent', () => {
  let component: AddEditInterviewScheduleComponent;
  let fixture: ComponentFixture<AddEditInterviewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditInterviewScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInterviewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
