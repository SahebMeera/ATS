import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewerComponentComponent } from './doc-viewer-component.component';

describe('DocViewerComponentComponent', () => {
  let component: DocViewerComponentComponent;
  let fixture: ComponentFixture<DocViewerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocViewerComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
