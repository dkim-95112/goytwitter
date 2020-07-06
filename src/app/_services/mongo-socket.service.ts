import {environment} from '@environments/environment';
import Debug from 'debug';

const debug = Debug('app:mongosocket');
const error = Debug('app:err:mongosocket'); // Assuming enabled
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

interface MongoInsertResponse {
  clusterTime: string; // "6830500526229028865"
  documentKey: {
    _id: string; // "5ecad0093ffe4cfaeffa9fe9"
  };
  fullDocument: {
    _id: string; // "5ecad0093ffe4cfaeffa9fe9"
    bodyText: string; // "test"
    creator: string;
    createDate: string;
    displayName: string;
  };
  __v: number;
  ns: {
    db: string; // "test"
    coll: string; // "toots"
  };
  operationType: 'insert';
}

interface MongoDeleteResponse {
  clusterTime: string; // "6830500169746743299"
  documentKey: {
    _id: string; // "5ecacb96ce029ed1ceaf9399"
  };
  ns: {
    db: string; // "test",
    coll: string; // "toots"
  };
  operationType: 'delete';
  _id: {
    _data: string; // "825ECACFB7000000032B022C0100296E5A1004DB75985948AB…43CBFBA46645F696400645ECACB96CE029ED1CEAF93990004"
  };
}

@Injectable({
  providedIn: 'root'
})
export class MongoSocketService {
  private readonly websocketUrl = environment.websocketUrl;
  private webSocket: WebSocket;
  private insertSubject = new Subject<MongoInsertResponse>();
  private deleteSubject = new Subject<MongoDeleteResponse>();
  private otherSubject = new Subject<any>();

  constructor() {
    // Broadcasting mongodb changes (push-notifications)
    this.webSocket = new WebSocket(this.websocketUrl);
    this.webSocket.addEventListener(
      'open', (ev) => {
      debug('onopen: %o', ev);
    });
    this.webSocket.addEventListener(
      'message', (ev) => {
      debug('message: %o', ev.data);
      const msg = JSON.parse(ev.data) as
        MongoInsertResponse | MongoDeleteResponse;
      if (msg.operationType) {
        switch (msg.operationType) {
          case 'insert':
            this.insertSubject.next(msg as MongoInsertResponse);
            break;
          case 'delete':
            this.deleteSubject.next(msg as MongoDeleteResponse);
            break;
          default:
            error('handler not implemented yet: %o', msg)
            this.otherSubject.next(msg);
        }
      } else {
        this.otherSubject.next(msg);
      }
    });
    this.webSocket.addEventListener(
      'close', (ev) => {
      debug('close: %o', ev);
    });
    this.webSocket.addEventListener(
      'error', (ev) => {
      error('error: %o', ev);
    });
  }

  getInsertObservable() {
    return this.insertSubject.asObservable();
  }

  getDeleteObservable() {
    return this.deleteSubject.asObservable();
  }
}
