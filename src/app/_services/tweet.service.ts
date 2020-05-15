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
  private tweetUrl = 'http://localhost:3000/tweets'; // 'assets/tweets.json';
  socket$: WebSocketSubject<unknown>; // For incoming mongo notifications
  tweets: Tweet[];

  constructor(
    private http: HttpClient,
  ) {
    this.http.get<Tweet[]>(this.tweetUrl)
      .subscribe(
        msg => {
          console.log('http got tweets');
          this.tweets = msg;
        },
        TweetService.handleError,
        () => {
          console.log('http get tweets complete');
        }
      );
    // Using websocket subject to broadcast mongodb changes (push-notifications)
    this.socket$ = webSocket('ws://localhost:3000');
    this.socket$.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('socket message received: %o', msg);
      },
      TweetService.handleError,
      () => {
        console.log('complete'); // Called when connection is closed (for whatever reason).
      }
    );
  }

  private static handleError(error: HttpErrorResponse) {
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

  insertTweet$(bodyText: string) {
    const tweet: Tweet = {
      body_text: bodyText
    };
    console.log('inserting tweet');
    return this.http.post<InsertedTweetsResponse>(this.tweetUrl, tweet)
      .pipe(
        catchError(TweetService.handleError)
      );
  }
}
