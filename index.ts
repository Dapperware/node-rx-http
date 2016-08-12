'use strict';
import http = require('http');
import Rx = require('rxjs');

declare const module;

type RequestOptions = http.RequestOptions;

var observableHttp = {};
observableHttp['get'] = observableGet;
observableHttp['request'] = observableRequest;

module.exports = observableHttp;

function observableGet(options: RequestOptions | string) {
    return observableRequest(options);
}

function observableRequest(options: RequestOptions | string, body?: any) {
    return new RequestObservable(options, body);
}

class RequestObservable extends Rx.Observable<any> {
    constructor(private options: RequestOptions | string, private body?: any) {
        super();
    }

    protected _subscribe(subscriber: Rx.Subscriber<any>) {
        var subscription = new Rx.Subscription();
        var req = http.request(this.options);

        var s1 = Rx.Observable.fromEvent(req, 'response')
            .first()
            .flatMap(
                (res: http.IncomingMessage) => {
                    var data = Rx.Observable.fromEvent(res, 'data');
                    var done = Rx.Observable.fromEvent(res, 'end');
                    return data.takeUntil(done)
                        .reduce((body: string, delta: string) => body + delta, '');
                },
                ({statusCode, headers}, body: string) => ({
                    statusCode: statusCode,
                    headers: headers,
                    body: body
                }))
            .subscribe(subscriber);

        var s2 = Rx.Observable.fromEvent(req, 'error', e => { throw e; })
            .subscribe(subscriber);
        subscription.add(s2);

        this.body && req.write(this.body);
        req.end();

        return subscription;
    }
}

