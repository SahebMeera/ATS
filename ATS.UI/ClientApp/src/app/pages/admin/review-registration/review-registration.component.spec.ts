import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRegistrationComponent } from './review-registration.component';

describe('ReviewRegistrationComponent', () => {
  let component: ReviewRegistrationComponent;
  let fixture: ComponentFixture<ReviewRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
