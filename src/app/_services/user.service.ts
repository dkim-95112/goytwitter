import {environment} from '@environments/environment';
import {Injectable} from '@angular/core';
import Debug from 'debug';

const debug = Debug('app:svc:user.debug');
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../_models';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private bIsLoggedIn: boolean;
  private login$: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
  ) {
    this.login$ = new BehaviorSubject<boolean>(
      this.bIsLoggedIn = !!this.currentUser
    );
  }

  get currentUser(): User {
    const u = JSON.parse(
      localStorage.getItem('currentUser')
    );
    return u && {
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      createDate: new Date(u.createDate),
    } as User;
  }

  get isLoggedIn() {
    return this.bIsLoggedIn;
  }

  get userId() {
    const currentUser = this.currentUser;
    return currentUser && currentUser.id;
  }

  get displayName() {
    const currentUser = this.currentUser;
    return currentUser && currentUser.displayName;
  }

  getLoginAsObservable() {
    return this.login$.asObservable();
  }

  getSession() {
    return this.http.get(
      `${environment.apiUrl}/user/session`, {
        withCredentials: true,
      }
    );
  }

  postSession() {
    return this.http.post(
      `${environment.apiUrl}/user/session`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  deleteSession() {
    return this.http.delete(
      `${environment.apiUrl}/user/session`,
      {
        withCredentials: true,
      }
    );
  }

  resetPassword(queryToken, newPassword) {
    return this.http.put<{
      message: string
    }>(
      `${environment.apiUrl}/user/resetpassword`,
      {
        queryToken,
        newPassword,
      },
    ).pipe(
      tap(result => debug(result)),
      catchError((err: HttpErrorResponse) => {
        throw new Error(`Reset password: ${err}`);
      }),
    );
  }

  sendForgotPasswordEmail(email) {
    return this.http.post<{
      status: 'Success' | 'Failure',
      info: {
        accepted: string[];
      }
    }>(
      `${environment.apiUrl}/user/sendmail/forgotpassword`,
      {
        email,
      },
    ).pipe(
      tap(result => {
        debug(result);
      }),
      catchError((err: HttpErrorResponse) => {
        throw new Error('Forgot password: ' + err);
      })
    );
  }

  signup(
    displayName: string,
    email: string,
    password: string
  ) {
    debug('Signup');
    return this.http.post<{
      status: 'Success' | 'Failure',
      messages: string[],
      result?: {
        _id: string,
      }
    }>(
      `${environment.apiUrl}/user/signup`,
      {displayName, email, password},
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        throw Error('signup svc: ' + err.error.message);
      }),
    );
  }

  login(email: string, password: string) {
    debug('Login');
    return this.http.post<{
      status: 'Success' | 'Failure',
      messages?: string[],
      userId?: string,
      email?: string,
      displayName?: string,
      createDate?: string,
    }>(
      `${environment.apiUrl}/user/login`,
      {email, password},
      {
        withCredentials: true,
      }
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        debug(err);
        throw new Error('user:svc:login error ' + err);
      }),
      map((resp) => {
        debug('Login received: %o', resp);
        switch (resp.status) {
          case 'Failure':
            return {
              status: 'Failure',
              messages: resp.messages,
            };
          case 'Success':
            // store user details and jwt token in local storage
            localStorage.setItem('currentUser', JSON.stringify({
              id: resp.userId,
              email: resp.email,
              displayName: resp.displayName,
              createDate: resp.createDate,
            }));
            this.login$.next(
              this.bIsLoggedIn = true
            );
            return {
              status: 'Success',
            };
        }
      })
    );
  }

  logout() {
    debug('Logout');
    return this.deleteSession().pipe(
      map(value => {
        localStorage.removeItem('currentUser');
        this.login$.next(
          this.bIsLoggedIn = false
        );
      })
    );
  }
}
