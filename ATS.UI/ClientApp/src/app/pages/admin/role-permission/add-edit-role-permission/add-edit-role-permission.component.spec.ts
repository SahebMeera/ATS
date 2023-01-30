import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRolePermissionComponent } from './add-edit-role-permission.component';

describe('AddEditRolePermissionComponent', () => {
  let component: AddEditRolePermissionComponent;
  let fixture: ComponentFixture<AddEditRolePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRolePermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
