import {Component, OnInit, ViewChild} from '@angular/core';
import { Customer, Representative } from 'src/app/demo/domain/customer';
import { Product } from 'src/app/demo/domain/product';
import { Table } from 'primeng/table/primeng-table';
import { ProductService } from 'src/app/demo/service/productservice';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { IRegistration, IRegistrationDisplay } from 'src/app/core/interfaces/registration';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {MessageService} from 'primeng/api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DataProvider } from 'src/app/core/providers/data.provider';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RegistrationService } from '../../registration/registration.service';
import { ICountryDisplay } from '../../../core/interfaces/country';
import { IStateDisplay } from '../../../core/interfaces/state';
import { CommonUtils } from '../../../common/common-utils';
import { IRolePermissionDisplay } from '../../../core/interfaces/rolePermission';
import { ConstantModules } from '../../../constant';


@Component({
  selector: 'app-review-registration',
  templateUrl: './review-registration.component.html',
  styleUrls: ['./review-registration.component.scss'],
   providers: [MessageService, ConfirmationService]
})
export class ReviewRegistrationComponent implements OnInit {
    commonUtils = new CommonUtils();

    registrations: IRegistrationDisplay[];
    constantModules = ConstantModules;
    rolePermissions: IRolePermissionDisplay[] = [];
    rolePermission: IRolePermissionDisplay;
    isAddRolePermission: boolean = false;
    isUpdateRolePermission: boolean = false;

  rowGroupMetadata: any;

  activityValues: number[] = [0, 100];

  @ViewChild('dt') table: Table;

  registrationDialog: boolean  = false;

  submitted: boolean;

    cols: any[];
    countryList: ICountryDisplay[] = [];
    stateList: IStateDisplay[] = [];

  editRegistrationForm: FormGroup;
  registration: IRegistrationDisplay;
  updateRegistrationForm: IRegistration;


  constructor(public messageService: MessageService,
    private dataProvider: DataProvider,
    private registrationService: RegistrationService,
    private fb: FormBuilder, 
    private router: Router,
      private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
      this.rolePermissions = JSON.parse(localStorage.getItem('role-permission'));
      if (this.rolePermissions !== null && this.rolePermissions !== undefined && this.rolePermissions.length > 0) {
          this.rolePermission = this.rolePermissions.find(x => x.moduleShort === this.constantModules.USER);
          this.isAddRolePermission = false;
          this.isUpdateRolePermission = false;
          if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.add === false) {
              this.isAddRolePermission = true;
          }
          if (this.rolePermission !== null && this.rolePermission !== undefined && this.rolePermission.update === false) {
              this.isUpdateRolePermission = true;
          }
      }
      this.loadDropDownList();
      this.buildEditRegistrationForm({}, 'New');
      this.loadReviewRegistrationList();
      this.breadcrumbService.setItems([
          {label: 'Table'}
      ]);
  }
    isCompleteStatus: any[] = [];
    isAtciveStatus: any[] = [];
    items: MenuItem[];
    ngOnInit() {
        this.cols = [
            { field: 'firstName', header: 'FirstName' },
            { field: 'lastName', header: 'LastName' },
            { field: 'country', header: 'Country' },
            { field: 'company', header: 'Company' },
            { field: 'phone', header: 'Phone' }
        ];
        this.isAtciveStatus = [
            { label: 'Active', value: true },
            { label: 'NotActive', value: false }
        ]
        this.isCompleteStatus = [
            { label: 'Complete', value: true },
            { label: 'NotComplete', value: false }
        ]
    }
    activeItem: IRegistrationDisplay;
    loadMobilesItems() {
        this.items = [
            { label: 'Edit', icon: 'pi pi-pencil', styleClass: this.getClass(), command: (e) => { this.activeItem !== null ? this.editProduct(this.activeItem): "" } },
            { label: 'Notes', icon: 'pi pi-check', command: (e) => { this.activeItem !== null ?  this.approveRegistration(this.activeItem) : "" } },
        ];
    }
    getClass(): string {
        if (this.isUpdateRolePermission === true) {
            return 'display-none';
        } else {
            return '';
        }
    }
    loadDropDownList() {
        forkJoin(
            this.registrationService.getCountryList(),
            this.registrationService.getStateList()
        ).subscribe(result => {
            this.countryList = result[0];
            this.stateList = result[1];
        })
    }

    toggleMenu(menu, event, rowData) {
        this.activeItem = rowData;
        menu.toggle(event);
    }

    loadReviewRegistrationList() {
        this.registrationService.getRegistrationList().subscribe(result => {
            this.registrations = result;
            this.loadMobilesItems();
            //this.table.clear();
            //this.table.filters['isComplete'] = [{ value: true, operator: "boolean", matchMode: "equals" }];
        });
    }
buildEditRegistrationForm(data: any, keyName: string) {
    this.editRegistrationForm = this.fb.group({
      FirstName: [keyName === 'New' ? '' : data.firstName, Validators.required],
      LastName: [keyName === 'New' ? '' : data.lastName, Validators.required],
      Phone: [keyName === 'New' ? null : data.phone, Validators.required],
      Email: [keyName === 'New' ? '' : data.email, [Validators.required, Validators.email]],
      Password: [keyName === 'New' ? '' : data.password,  Validators.required],
      Company: [keyName === 'New' ? '' : data.company, Validators.required],
      WebSite: [keyName === 'New' ? '' : data.companyURL, Validators.required],
      City: [keyName === 'New' ? '' : data.city, Validators.required],
      StateID: [keyName === 'New' ? null : data.stateID,Validators.required],
      CountryID: [keyName === 'New' ? null : data.countryID, Validators.required],
      ZipCode: [keyName === 'New' ? null : data.zipCode, Validators.required],
    }
    );
  }

    editProduct(registration: IRegistrationDisplay) {
    this.registration = registration;
    this.buildEditRegistrationForm(this.registration, 'Edit')
    this.registrationDialog = true;

}

    approveRegistration(registration: IRegistrationDisplay) {
        this.registration = registration;
        this.updateRegistrationForm = {
            RegistrationID: this.registration.registrationID,
            FirstName: this.registration.firstName,
            LastName: this.registration.lastName,
            Email: this.registration.email,
            Phone: this.registration.phone,
            Password: this.registration.password,
            ConfirmPassword: this.registration.confirmPassword,
            Company: this.registration.company,
            CompanyURL: this.registration.companyURL,
            City: this.registration.city,
            StateID: this.registration.stateID,
            CountryID: this.registration.countryID,
            ZIPCode: this.registration.zipCode,
            GUID: this.registration.guid,
            IsActive: this.registration.isActive,
            IsComplete: this.registration.isComplete,
            RecordID: this.registration.recordID,
            DateCreated: this.registration.dateCreated,
            CreatedBy: this.registration.createdBy,
            DateModified: this.registration.dateModified,
            ModifiedBy: this.registration.modifiedBy,
            //TimeStamp: this.registration.timeStamp
            //ReturnCode: 0
        }
        console.log(this.updateRegistrationForm)
        this.registrationService.sendRegistrationMail(this.updateRegistrationForm).subscribe(result => {
            this.messageService.add({ severity: 'success', summary: 'Registration Mail Send Successfully', detail: '' });

            //this.loadReviewRegistrationList();
            this.registration = <IRegistrationDisplay>{} as IRegistrationDisplay;
        })
}

Cancel() {
    this.registrationDialog = false;
    this.submitted = false;
}

saveRegistration() {
    this.submitted = true;
    if (this.editRegistrationForm.invalid) {
        this.editRegistrationForm.markAllAsTouched();
        return;
    } else {
            this.updateRegistrationForm = {
                RegistrationID: this.registration.registrationID,
                FirstName: this.editRegistrationForm.value.FirstName,
                LastName: this.editRegistrationForm.value.LastName,
                Email: this.editRegistrationForm.value.Email,
                Phone: this.editRegistrationForm.value.Phone,
                Password: this.editRegistrationForm.value.Password,
                ConfirmPassword: this.editRegistrationForm.value.ConfirmPassword,
                Company: this.editRegistrationForm.value.Company,
                CompanyURL: this.editRegistrationForm.value.WebSite,
                City: this.editRegistrationForm.value.City,
                StateID: this.editRegistrationForm.value.StateID,
                CountryID: this.editRegistrationForm.value.CountryID,
                ZIPCode: (this.editRegistrationForm.value.ZipCode).toString(),
                GUID: this.registration.guid,
                IsActive: this.registration.isActive,
                IsComplete: this.registration.isComplete,
                RecordID: this.registration.recordID,
                DateCreated: this.registration.dateCreated,
                CreatedBy: this.registration.createdBy,
                DateModified: new Date(),
                ModifiedBy: "",
               // TimeStamp: new Date(),
                //ReturnCode: 0
            }
        this.registrationService.updateRegistration(this.updateRegistrationForm).subscribe(result => {
            this.messageService.add({ severity: 'success', summary: 'Registration Save Successfully', detail: '' });
            this.loadReviewRegistrationList();
            this.registrationDialog = false;
            this.registration = <IRegistrationDisplay>{} as IRegistrationDisplay;
            })
        
      }
    }

get editRegitrationFormControls() { return this.editRegistrationForm.controls; }
    applyFilterGlobal() {
        this.commonUtils.SearchFunction();
    }

}
