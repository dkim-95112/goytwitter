import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {User} from '../_models';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedInPrivate: boolean;
  private loginListener$: BehaviorSubject<boolean>;
  private currentUser$: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
  ) {
    this.loginListener$ = new BehaviorSubject<boolean>(
      this.isLoggedInPrivate = false
    );
    this.currentUser$ = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
  }

  get isLoggedIn() {
    return this.isLoggedInPrivate;
  }

  getLoginListenerObservable() {
    return this.loginListener$.asObservable();
  }

  getCurrentUserObservable(): Observable<User> {
    return this.currentUser$.asObservable();
  }

  signup(email: string, password: string) {
    console.log('signup user svc');
    return this.http.post<{
      message: string,
      result: {
        email: string,
        password: string,
        __v: number, // mongo save thingy ?
        _id: string,
      }
    }>(
      `${environment.apiUrl}/users/signup`,
      {email, password},
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        throw Error('signup svc: ' + err.error.message);
      }),
      map(resp => {
        console.log('signup svc: %o', resp);
        return {
          id: resp.result._id
        };
      })
    );
  }

  login(email: string, password: string) {
    console.log('login user svc');
    return this.http.post<{
      token: string,
      expiresInSeconds: number,
      userId: string
    }>(
      `${environment.apiUrl}/users/login`,
      {email, password}
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('login user svc: %o', err);
        throw new Error('login user svc: ' + err.error.message);
      }),
      map(resp => {
        console.log('login user svc %o', resp);
        // store user details and jwt token in local storage
        localStorage.setItem('currentUser', JSON.stringify(resp));
        this.currentUser$.next({
          id: resp.userId,
          email,
          firstName: 'foo',
          lastName: 'bar',
          token: resp.token,
          tokenExpiry: new Date(
            Date.now() + resp.expiresInSeconds * 1000
          )
        });
        this.loginListener$.next(
          this.isLoggedInPrivate = true
        );
        return {
          message: 'login user svc foo'
        };
      })
    );
  }

  logout() {
    console.log('User svc logout');
    this.loginListener$.next(
      this.isLoggedInPrivate = false
    );
    this.currentUser$.next(null);
    localStorage.removeItem('currentUser');
  }
}
