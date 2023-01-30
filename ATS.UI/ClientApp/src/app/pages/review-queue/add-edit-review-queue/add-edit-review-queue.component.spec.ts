import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReviewQueueComponent } from './add-edit-review-queue.component';

describe('AddEditReviewQueueComponent', () => {
  let component: AddEditReviewQueueComponent;
  let fixture: ComponentFixture<AddEditReviewQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditReviewQueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReviewQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
