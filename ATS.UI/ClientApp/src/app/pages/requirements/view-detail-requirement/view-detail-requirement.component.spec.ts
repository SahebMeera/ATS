import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailRequirementComponent } from './view-detail-requirement.component';

describe('ViewDetailRequirementComponent', () => {
  let component: ViewDetailRequirementComponent;
  let fixture: ComponentFixture<ViewDetailRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDetailRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
