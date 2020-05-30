import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {Toot} from '../_models';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '@environments/environment';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TootService implements OnDestroy {
  private tootUrl = `${environment.apiUrl}/toots`; // 'assets/toots.json';
  private wsSubject: WebSocketSubject<{
    operationType: string;
    userId: string,
    heartbeatDateIso?: string;
  }>; // For incoming mongo notifications
  private heartbeatTimeout: number;
  private wsInsertObservable: Observable<{
    // Mongo watch insert
    clusterTime: string; // "6830500526229028865"
    documentKey: {
      _id: string; // "5ecad0093ffe4cfaeffa9fe9"
    };
    fullDocument: {
      _id: string; // "5ecad0093ffe4cfaeffa9fe9"
      bodyText: string; // "test"
    };
    __v: number;
    ns: {
      db: string; // "test"
      coll: string; // "toots"
    };
    operationType: 'insert';
  }>;
  private wsDeleteObservable: Observable<{
    // Mongo watch delete
    clusterTime: string; // "6830500169746743299"
    documentKey: {
      _id: string; // "5ecacb96ce029ed1ceaf9399"
    }
    ns: {
      db: string; // "test",
      coll: string; // "toots"
    };
    operationType: 'delete';
    _id: {
      _data: string; // "825ECACFB7000000032B022C0100296E5A1004DB75985948AB…43CBFBA46645F696400645ECACB96CE029ED1CEAF93990004"
    };
  }>;
  private wsOtherObservable: Observable<any>;
  private wsInsertSubscription: Subscription;
  private wsDeleteSubscription: Subscription;
  private wsOtherSubscription: Subscription;
  private toots: Toot[];
  private tootsSubject: BehaviorSubject<Toot[]>;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.tootsSubject = new BehaviorSubject<Toot[]>([]);

    // Broadcasting mongodb changes (push-notifications)
    this.wsSubject = webSocket({
      url: environment.websocketUrl,
      openObserver: {
        next: (v) => {
          console.log('websocket open next: %o', v);
          this.resetHeartbeat();
        },
        error: (err) => {
          console.error('websocket open: %o', err);
        },
        complete: () => {
          console.log('websocket open complete');
        }
      },
      closingObserver: {
        next: (v) => {
          console.log('websocket closing next');
        },
        error: (err) => {
          console.error('websocket closing: %o', err);
        },
        complete: () => {
          console.log('websocket closing complete');
        }
      },
      closeObserver: {
        next: (v) => {
          console.log('websocket close next: %o', v);
        },
        error: (err) => {
          console.error('websocket close error: %o', err);
        },
        complete: () => {
          console.log('websocket close complete');
        }
      },
    });
    this.wsInsertObservable = this.wsSubject.multiplex(
      () => ({subscribe: 'insert'}),
      () => ({unsubscribe: 'insert'}),
      msg => msg.operationType === 'insert'
    );
    this.wsDeleteObservable = this.wsSubject.multiplex(
      () => ({subscribe: 'delete'}),
      () => ({unsubscribe: 'delete'}),
      msg => msg.operationType === 'delete'
    );
    this.wsOtherObservable = this.wsSubject.multiplex(
      // When server gets this message, it will start sending messages for 'A'...
      () => ({subscribe: 'other'}),
      // ...and when gets this one, it will stop.
      () => ({unsubscribe: 'other'}),
      msg => {
        // If the function returns `true` message is passed down the stream. Skipped if the function returns false.
        return !msg.operationType ||
          !['insert', 'delete'].includes(msg.operationType);
      }
    );
    this.wsInsertSubscription = this.wsInsertObservable.subscribe(
      msg => {
        console.log('websocket insert received: %o', msg);
        this.resetHeartbeat();
        // For now, checking if exists
        const idx = this.toots.findIndex(
          t => t.id === msg.fullDocument._id
        );
        if (idx > -1) {
          console.warn('Found existing, so deleting first');
          this.toots.slice(idx, 1);
        }
        this.toots.push({
          id: msg.fullDocument._id,
          bodyText: msg.fullDocument.bodyText,
        } as Toot);
        this.tootsSubject.next(this.toots);
      },
      err => {
        console.error('websocket insert: %o', err);
      },
      () => {
        console.log('websocket insert complete');
      }
    );
    this.wsDeleteSubscription = this.wsDeleteObservable.subscribe(
      msg => {
        console.log('websocket delete received: %o', msg);
        this.resetHeartbeat();
        this.tootsSubject.next(
          this.toots = this.toots.filter(
            t => t.id !== msg.documentKey._id
          )
        );
      },
      err => {
        console.error('websocket delete: %o', err);
      },
      () => {
        console.log('websocket delete complete');
      }
    );

    this.wsOtherSubscription = this.wsOtherObservable.subscribe(
      msg => {
        // Called whenever there is a message from the server.
        console.log('websocket other received: %o', msg);
        this.resetHeartbeat();
      },
      err => {
        console.error('websocket other: %o', err);
      },
      () => {
        console.log('websocket other complete');
      }
    );
  }

  private resetHeartbeat() {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }
    this.heartbeatTimeout = setTimeout(
      () => {
        this.wsSubject.next({
          operationType: 'heartbeat',
          userId: this.userService.userId,
          heartbeatDateIso: (new Date()).toISOString(),
        });
      },
      // Now using aws classic load balancer with 60 second ttl socket
      50 * 1000,
    );
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
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }
    this.wsInsertSubscription.unsubscribe();
    this.wsDeleteSubscription.unsubscribe();
    this.wsOtherSubscription.unsubscribe();
    this.wsSubject.complete();
  }

  getTootsObservable() {
    return this.tootsSubject.asObservable();
  }

  fetchToots() {
    console.log('toot svc fetching');
    return this.http.get<{
      message: string,
      docs: any[]
    }>(
      this.tootUrl
    ).pipe(
      tap(() => console.log('fetched toots')),
      map(v => {
        return v.docs.map(d => {
          return {
            id: d._id,
            bodyText: d.bodyText,
          } as Toot;
        });
      })
    ).subscribe(
      toots => {
        this.tootsSubject.next(
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
    console.log('toot svc deleting');
    return this.http.delete<{
      message: string
    }>(
      this.tootUrl + '/' + tootId
    ).subscribe(
      resp => {
        console.log('delete toot svc received: %o', resp);
        // this.tootsSubject.next(
        //   this.toots = this.toots.filter(
        //     t => t.id !== tootId
        //   )
        // );
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
      this.tootUrl, {
        bodyText
      }
    ).pipe(
      map(resp => {
        console.log('insert toot svc received: %o', resp);
        return {
          bodyText: resp.doc.bodyText,
          id: resp.doc._id,
        } as Toot;
      })
    ).subscribe(
      toot => {
        // console.log('inserted toot svc: %o', toot);
        // this.toots.push(toot);
        // this.tootsSubject.next(this.toots);
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
