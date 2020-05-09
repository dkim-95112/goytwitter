import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {InsertedTweetsResponse, Tweet} from '../_models';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  tweetUrl = 'http://localhost:3000/tweets'; // 'assets/tweets.json';
  socket$: WebSocketSubject<unknown>;

  constructor(
    private http: HttpClient,
  ) {
    this.socket$ = webSocket('ws://localhost:3000');
    this.socket$.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('socket message received: %o', msg);
      },
      err => {
        // Called if at any point WebSocket API signals some kind of error.
        console.log(err);
      },
      () => {
        console.log('complete'); // Called when connection is closed (for whatever reason).
      }
    );
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

  create(bodyText: string) {
    const tweet: Tweet = {
      body_text: bodyText
    };
    return this.http.post<InsertedTweetsResponse>(this.tweetUrl, tweet)
      .pipe(
        catchError(TweetService.handlerError)
      );
  }

  getTweets() {
    return this.http.get<Tweet[]>(this.tweetUrl)
      .pipe(
        catchError(TweetService.handlerError)
      );
  }
}
