import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../_models';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
  }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserValue && !!this.currentUserValue.token;
  }

  login(username: string, password: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/users/authenticate`,
      {username, password}
    )
      .pipe(
        map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
