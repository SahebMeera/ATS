import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataProvider } from 'src/app/core/providers/data.provider';
import { LoginService } from './login.service';
import { Md5 } from 'ts-md5';
import { IUser, IUserDisplay, IUserForm } from '../../core/interfaces/user';
import { UserService } from '../admin/user/user.service';

import { AuthenticationService } from 'src/app/_services';
import { User } from '../../_models/user';
import * as CryptoJS from 'crypto-js';
import { RolePermissionService } from '../admin/role-permission/role-permission.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotEmail: string = '';
  isForgotPassword: boolean = false;
  submitted: boolean = false;
  isLoginValid: boolean = true;
  isPasswordAdded: boolean = false;
  passwordForm: FormGroup;
  userInfo: User;
  updateUserForm: IUserForm;
  secretKey = "7534275896345678";

  constructor(private dataProvider: DataProvider,
    private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
    private md5: Md5,
    private loginService: LoginService,
      private authenticationService: AuthenticationService,
      private rolePermissionService: RolePermissionService) {
      this.buildLoginForm({}, 'New');
      this.buildPasswordUpdatedForm({}, 'New');
     }

  ngOnInit(): void {
      this.isForgotPassword = false;
      // this.isLoginValid = false;
  }

  buildLoginForm(data: any, keyName: string) {
    this.loginForm = this.fb.group({
      Email: [keyName === 'New' ? '' : data.Email, [Validators.required, Validators.email]],
      Password: [keyName === 'New' ? '' : data.Password,  Validators.required]
    });
  }

  get loginFormControls() { return this.loginForm.controls; }
  get passwordFormControls() { return this.passwordForm.controls; }

    Encryption(number) {
        console.log(number);
        var key = CryptoJS.enc.Utf8.parse(this.secretKey);
        var iv = CryptoJS.enc.Utf8.parse(this.secretKey);
        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(number), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    }

    signIn() {
        this.isPasswordAdded = false;
        this.submitted = true;
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        } else {
            const email: string = this.loginForm.controls.Email.value;
            const password: string = this.Encryption(this.loginForm.controls.Password.value).toString();
            this.authenticationService.login(email, password).subscribe(result => {
                //const userDetails = result;
                this.userInfo = <User>{} as User;
                this.userInfo = result;
                if (result.isValid === true && result.isTempPassword === false && result.isActive === true && result.isCompanyActive === true) {
                    this.isLoginValid = true;
                    this.isPasswordAdded = false;
                    this.rolePermissionService.getRolePermission().subscribe(res => {
                        res =  res.filter(x => Number(x.roleID) === Number(this.userInfo.roleID));
                        localStorage.setItem("role-permission", JSON.stringify(res));
                        localStorage.removeItem("ats-current-loggedin-user");
                        localStorage.setItem('ats-current-loggedin-user', JSON.stringify(result));
                        this.router.navigate(['/dashboard']);
                    });
                } else if (result.isValid === true && result.isTempPassword === true && result.isActive === true && result.isCompanyActive === true) {
                    this.updateUserForm = <IUserForm>{} as IUserForm;
                   // this.loadUserDetails(result.id);
                    this.buildPasswordUpdatedForm({}, 'New');
                    this.isLoginValid = true;
                    this.isPasswordAdded = true;
                } else {
                    this.isPasswordAdded = false;
                    this.isLoginValid = false;
                }
            });
        }
    }
    loadUserDetails(ID: number) {
        this.userService.getUserDetail(ID).subscribe(result => {
            console.log(result);
        })
    }
    
    buildPasswordUpdatedForm(data: any, keyName: string) {
        console.log('data', data)
        this.passwordForm = this.fb.group({
            Password: [keyName === 'New' ? '' : data.Password, Validators.required],
            ConfirmPassword: [keyName === 'New' ? '' : data.ConfirmPassword, Validators.required]
        }, {
            validator: this.confirmedValidator("Password", "ConfirmPassword")
        });
    }

    confirmedValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    passwordUpdate() {
        console.log('here')
        this.submitted = true;
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        } else {
            this.updateUserForm = {
                UserID: this.userInfo.id,
                Email: this.userInfo.email,
                FirstName: this.userInfo.firstName,
                LastName: this.userInfo.lastName,
                CompanyID: this.userInfo.companyID,
                RoleID: this.userInfo.roleID,
                Password: this.passwordForm.controls.Password.value,
                IsActive: this.userInfo.isActive,
                IsTempPassword: false,
                //RecordID: this.userInfo.recordID,
                DateCreated: new Date(),
                CreatedBy: this.userInfo.firstName + '' + this.userInfo.lastName,
                DateModified: new Date(),
                ModifiedBy: this.userInfo.firstName + ''+this.userInfo.lastName,
                //TimeStamp: new Date(),
            }
            this.userService.updatePassword(this.updateUserForm).subscribe(result => {
                this.isPasswordAdded = false;
                this.isLoginValid = true;
                this.isForgotPassword = false;
                this.loginForm.controls.Email.patchValue(this.userInfo.email);
                this.loginForm.controls.Password.patchValue('');
                console.log(result);
            })
        }
    }

  forgotPassword() {
      this.isForgotPassword = true;
      this.isLoginValid = true;
  }
  forgotPasswordCancel() {
      this.isForgotPassword = false;
      this.isLoginValid = true;
  }

  forgotPasswordSubmit() {
console.log('submit');

  }


}
