'use strict';
import { request as httpRequest, IncomingMessage, RequestOptions as httpRequestOptions } from 'http';
import { Observable, Subscriber, fromEvent } from 'rxjs';
import { first, map, mergeMap, reduce, takeUntil } from 'rxjs/operators';

type RequestOptions = httpRequestOptions;

export const methods = {
  get: observableGet,
  request: observableRequest
};



function observableGet(options: RequestOptions | string) {
  return observableRequest(options);
}

function observableRequest(options: RequestOptions | string, body?: any) {
  return new RequestObservable(options, body);
}

class RequestObservable extends Observable<any> {
  constructor(private options: RequestOptions | string, private body?: any) {
    super();
  }

  _subscribe(subscriber: Subscriber<any>) {
    const req = httpRequest(this.options);

    const sub1 = fromEvent(req, 'response')
      .pipe(
        first(),
        mergeMap(
          (res: IncomingMessage) => {
            const data = fromEvent(res, 'data');
            const done = fromEvent(res, 'end');
            return data.pipe(
              takeUntil(done),
              reduce((body: string, delta: string) => body + delta, ''),
            );
          },
          ({ statusCode, headers }, body: string) => ({
            statusCode: statusCode,
            headers: headers,
            body: body,
          })),
      )
      .subscribe(subscriber);

    const sub2 = fromEvent(req, 'error')
      .pipe(
        map((e) => {
          throw e;
        }),
      )
      .subscribe(subscriber);

    sub1.add(sub2);

    this.body && req.write(this.body);
    req.end();

    return sub1;
  }
}

export default methods;