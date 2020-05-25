import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../error-dialog/error-dialog.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog,
  ) {
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const errors = ['Http Error'];
        if (err.message) {
          errors.push(err.message);
        }
        if (err.error && err.error.message) {
          errors.push(err.error.message);
        }
        this.dialog.open(ErrorDialogComponent, {
          data: {messages: errors}
        });
        return throwError(errors.join('\n'));
      })
    );
  }
}
