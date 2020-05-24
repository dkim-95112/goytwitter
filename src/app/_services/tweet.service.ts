import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, Subscription, throwError} from 'rxjs';
import {Tweet} from '../_models';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class TweetService implements OnDestroy {
  private tweetUrl = 'http://localhost:3001/tweets'; // 'assets/tweets.json';
  private websocketUrl = 'ws://localhost:3001';
  private socket$: WebSocketSubject<unknown>; // For incoming mongo notifications
  private webSocketSub: Subscription;
  private toots: Tweet[];
  private toots$: BehaviorSubject<Tweet[]>;

  constructor(
    private http: HttpClient,
  ) {
    // Broadcasting mongodb changes (push-notifications)
    this.socket$ = webSocket(this.websocketUrl);
    this.webSocketSub = this.socket$.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('socket message received: %o', msg);
      },
      err => {
        console.error('websocket: %o', err);
      },
      () => {
        console.log('complete'); // Called when connection is closed (for whatever reason).
      }
    );
    this.toots$ = new BehaviorSubject<Tweet[]>([]);
  }

  // private static handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // I've seen HttpResponseBase
  //     // DomException for websocket issue
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // }

  ngOnDestroy() {
    this.webSocketSub.unsubscribe();
  }

  getTootsObservable() {
    return this.toots$.asObservable();
  }

  fetchToots() {
    return this.http.get<{
      message: string,
      docs: any[]
    }>(
      this.tweetUrl
    ).pipe(
      map(v => {
        return v.docs.map(d => {
          return {
            id: d._id,
            bodyText: d.bodyText,
          } as Tweet;
        });
      })
    ).subscribe(
      toots => {
        console.log('fetched toots');
        this.toots$.next(
          this.toots = toots
        );
      },
      err => {
        console.error('fetched toots: %o', err);
      },
      () => {
        console.log('fetched toots complete');
      }
    );
  }

  delete(tootId: string) {
    console.log('deleting toot svc');
    return this.http.delete<{
      message: string
    }>(
      this.tweetUrl + '/' + tootId
    ).subscribe(
      resp => {
        console.log('deleted toot svc: %o', resp);
        this.toots$.next(
          this.toots = this.toots.filter(
            t => t.id !== tootId
          )
        );
      },
      err => {
        console.error('delete toot svc: %o', err);
      },
      () => {
        console.log('delete toot svc complete');
      }
    );
  }

  insert(bodyText: string) {
    console.log('toot svc inserting');
    return this.http.post<{
      message: string,
      doc: {
        bodyText: string,
        _id: string,
      },
    }>(
      this.tweetUrl, {
        bodyText
      }
    ).pipe(
      map(resp => {
        console.log('toot svc: %o', resp);
        return {
          bodyText: resp.doc.bodyText,
          id: resp.doc._id,
        } as Tweet;
      })
    ).subscribe(
      toot => {
        console.log('inserted toot svc: %o', toot);
        this.toots.push(toot);
        this.toots$.next(this.toots);
      },
      err => {
        console.error('insert toot svc: %o', err);
      },
      () => {
        console.log('insert toot svc complete');
      }
    );
  }
}
