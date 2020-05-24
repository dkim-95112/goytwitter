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
import {User} from '../_models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private currentUser: User;

  constructor(private userService: UserService) {
    this.userService.getCurrentUserObservable().subscribe(
      (u) => {
        this.currentUser = u;
      }
    );
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler):
    Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (this.currentUser && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.currentUser.token}`
        }
      });
    }
    return next.handle(request);
  }
}
