import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {
  delay,
  dematerialize,
  materialize,
  mergeMap
} from 'rxjs/operators';
import {User} from '../_models';

const users: User[] = [{
  id: 'asdf', email: 'test', displayName: 'Test'
}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
    const {url, method, headers, body} = request;
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      // call materialize and dematerialize to ensure delay even if an error is thrown
      // (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    // return next.handle(request);
    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/login') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const {email, password} = body;
      const user = users.find(x => {
        return x.email === email;
      });
      if (!user) {
        return throwError('Username or password is incorrect');
      }
      return ok({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        token: 'fake-jwt-token'
      });
    }

    function getUsers() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(users);
    }

    // helper functions

    function ok(b = body) {
      return of(new HttpResponse({status: 200, body: b}));
    }

    function unauthorized() {
      return throwError({
        status: 401,
        error: {message: 'Unauthorised'}
      });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }
  }
}

export const fakeBackendInterceptor = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
