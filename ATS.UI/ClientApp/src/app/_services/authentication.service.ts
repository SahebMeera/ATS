import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../core/interfaces/user';
import { User } from 'src/app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private validateLoginUserApiMethod = 'api/User/ValidateLoginUser';

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('ats-current-loggedin-user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        let user: IUser = {
            Email: email,
            Password: password,
            UserID: null
        };
        return this.http.post<User>(`${this.validateLoginUserApiMethod}`, user)
            .pipe(map(user => {
                console.log();
                localStorage.setItem('ats-current-loggedin-user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
          }));
    }

    logout() {
        localStorage.removeItem('ats-current-loggedin-user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
