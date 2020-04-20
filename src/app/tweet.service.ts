import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  tweetUrl = 'http://localhost:3000/tweets'; // 'assets/tweets.json';
  constructor(
    private http: HttpClient
  ) {
  }
  private static handlerError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
  getTweets() {
    return this.http.get<Tweet[]>(this.tweetUrl)
      .pipe(
        catchError(TweetService.handlerError)
      );
  }
}
export interface Tweet {
  body_text: string;
}

