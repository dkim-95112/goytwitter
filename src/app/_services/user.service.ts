import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '@environments/environment';
import {User} from '../_models';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isLoggedInPrivate: boolean;
  private login$: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
  ) {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser')
    ) as User;
    this.login$ = new BehaviorSubject<boolean>(
      this.isLoggedInPrivate = currentUser &&
        currentUser.token &&
        new Date(currentUser.tokenExpiryISO) > new Date()
    );
  }

  get isLoggedIn() {
    return this.isLoggedInPrivate;
  }

  get userId() {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser')
    ) as User;
    return currentUser && currentUser.id;
  }

  getLoginAsObservable() {
    return this.login$.asObservable();
  }

  signup(email: string, password: string) {
    console.log('signup user svc');
    return this.http.post<{
      message: string,
      result: {
        _id: string,
      }
    }>(
      `${environment.apiUrl}/users/signup`,
      {email, password},
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        throw Error('signup svc: ' + err.error.message);
      }),
    );
  }

  login(email: string, password: string) {
    console.log('login user svc');
    return this.http.post<{
      userId: string,
      email: string,
      displayName: string,
      token: string,
      expiresInSeconds: number,
    }>(
      `${environment.apiUrl}/users/login`,
      {email, password}
    ).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('login user svc: %o', err);
        throw new Error('login user svc: ' + err.error.message);
      }),
      map((resp) => {
        console.log('login user svc: %o', resp);
        // store user details and jwt token in local storage
        const user = {
          id: resp.userId,
          email: resp.email,
          displayName: resp.displayName,
          token: resp.token,
          tokenExpiryISO: (new Date(
            (new Date()).getTime() + resp.expiresInSeconds * 1000
          )).toISOString(),
        } as User;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.login$.next(
          this.isLoggedInPrivate = true
        );
        return {
          message: 'Success'
        };
      })
    );
  }

  logout() {
    console.log('User svc logout');
    this.login$.next(
      this.isLoggedInPrivate = false
    );
    localStorage.removeItem('currentUser');
  }
}
