import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {InsertedTweetsResponse, Tweet} from '../_models';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private tweetUrl = 'http://localhost:3001/tweets'; // 'assets/tweets.json';
  private websocketUrl = 'ws://localhost:3001';
  socket$: WebSocketSubject<unknown>; // For incoming mongo notifications

  constructor(
    private http: HttpClient,
  ) {
    // Using websocket subject to broadcast mongodb changes (push-notifications)
    this.socket$ = webSocket(this.websocketUrl);
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
      // I've seen HttpResponseBase
      // DomException for websocket issue
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

  getToots() {
    return this.http.get<{
      message: string,
      docs: any[]
    }>(this.tweetUrl)
      .pipe(
        catchError(TweetService.handleError),
        map(v => {
          return v.docs.map(d => {
            return {
              id: d._id,
              body_text: d.body_text,
            };
          });
        })
      );
  }
  delete(id: string) {
    console.log('service deleting');
    return this.http.delete<InsertedTweetsResponse>(
      this.tweetUrl + '/' + id
    ).pipe(
      catchError(TweetService.handleError)
    );
  }

  insertTweet$(bodyText: string) {
    const tweet: Tweet = {
      id: null,
      body_text: bodyText
    };
    console.log('service inserting');
    return this.http.post<InsertedTweetsResponse>(
      this.tweetUrl, tweet
    ).pipe(
      catchError(TweetService.handleError)
    );
  }
}
