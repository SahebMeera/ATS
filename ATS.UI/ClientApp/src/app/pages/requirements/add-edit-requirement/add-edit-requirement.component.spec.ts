import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRequirementComponent } from './add-edit-requirement.component';

describe('AddEditRequirementComponent', () => {
  let component: AddEditRequirementComponent;
  let fixture: ComponentFixture<AddEditRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
