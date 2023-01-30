import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSuccessMissComponent } from './candidate-success-miss.component';

describe('CandidateSuccessMissComponent', () => {
  let component: CandidateSuccessMissComponent;
  let fixture: ComponentFixture<CandidateSuccessMissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSuccessMissComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSuccessMissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
