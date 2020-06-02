import {environment} from '@environments/environment';
import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import Debug from 'debug';
const debug = Debug('app:toot:svc');
import {Toot} from '../_models';
import {UserService} from './user.service';
import {MongoSocketService} from './mongo-socket.service';

@Injectable({
  providedIn: 'root'
})
export class TootService implements OnDestroy {
  private tootUrl = `${environment.apiUrl}/toots`; // 'assets/toots.json';
  private toots: Toot[];
  private tootsSubject: BehaviorSubject<Toot[]>;
  private wsInsertSubscription: Subscription;
  private wsDeleteSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private mongoSocketService: MongoSocketService
  ) {
    this.tootsSubject = new BehaviorSubject<Toot[]>([]);
    this.wsInsertSubscription = this.mongoSocketService
      .getInsertObservable().subscribe(msg => {
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
      });
    this.wsDeleteSubscription = this.mongoSocketService
      .getDeleteObservable().subscribe(msg => {
        this.tootsSubject.next(
          this.toots = this.toots.filter(
            t => t.id !== msg.documentKey._id
          )
        );
      });
  }

  ngOnDestroy() {
    this.wsInsertSubscription.unsubscribe();
    this.wsDeleteSubscription.unsubscribe();
  }

  getTootsObservable() {
    return this.tootsSubject.asObservable();
  }

  fetchToots() {
    debug('Fetching');
    return this.http.get<{
      message: string,
      docs: any[]
    }>(
      this.tootUrl
    ).pipe(
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
        debug('Fetch received toots');
        this.tootsSubject.next(
          this.toots = toots
        );
      },
      err => {
        console.error('toots:svc:fetch error: %o', err);
      },
      () => {
        debug('fetch complete');
      }
    );
  }

  delete(tootId: string) {
    debug('Deleting');
    return this.http.delete<{
      status: 'Success' | 'Failure',
      messages?: string[],
    }>(
      this.tootUrl + '/' + tootId
    );
  }

  insert(bodyText: string) {
    debug('Inserting');
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
        debug('Insert received: %o', resp);
        return {
          bodyText: resp.doc.bodyText,
          id: resp.doc._id,
        } as Toot;
      })
    );
  }
}
