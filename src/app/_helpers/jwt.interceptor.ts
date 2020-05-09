import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from '../_services';
import {environment} from '@environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (this.userService.isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userService.currentUserValue.token}`
        }
      });
    }
    return next.handle(request);
  }
}
