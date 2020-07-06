import {environment} from '@environments/environment';
import {Injectable} from '@angular/core';
import Debug from 'debug';
const debug = Debug('app:user:svc');
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {User} from '../_models';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _isLoggedIn: boolean;
  private login$: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
  ) {
    const currentUser = this.currentUser;
    this.login$ = new BehaviorSubject<boolean>(
      this._isLoggedIn = currentUser &&
        currentUser.token &&
        currentUser.tokenExpiry > new Date()
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
      token: u.token,
      tokenExpiry: new Date(u.tokenExpiry),
    } as User;
  }

  get isLoggedIn() {
    return this._isLoggedIn;
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
      `${environment.apiUrl}/users/signup`,
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
      token?: string,
      expiresInSeconds?: number,
    }>(
      `${environment.apiUrl}/users/login`,
      {email, password}
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('user:svc:login error: %o', err);
        throw new Error('user:svc:login error ' + err.error.message);
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
            const user = {
              id: resp.userId,
              email: resp.email,
              displayName: resp.displayName,
              createDate: new Date(resp.createDate),
              token: resp.token,
              tokenExpiryISO: (new Date(
                (new Date()).getTime() + resp.expiresInSeconds * 1000
              )).toISOString(),
            } as User;
            localStorage.setItem('currentUser', JSON.stringify({
              id: resp.userId,
              email: resp.email,
              displayName: resp.displayName,
              createDate: resp.createDate,
              token: resp.token,
              tokenExpiry: (new Date(
                (new Date()).getTime() + resp.expiresInSeconds * 1000
              )).toISOString(),
            }));
            this.login$.next(
              this._isLoggedIn = true
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
    localStorage.removeItem('currentUser');
    this.login$.next(
      this._isLoggedIn = false
    );
  }
}
