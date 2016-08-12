'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var http = require('http');
var Rx = require('rxjs');
var observableHttp = {};
observableHttp['get'] = observableGet;
observableHttp['request'] = observableRequest;
module.exports = observableHttp;
function observableGet(options) {
    return observableRequest(options);
}
function observableRequest(options, body) {
    return new RequestObservable(options, body);
}
var RequestObservable = (function (_super) {
    __extends(RequestObservable, _super);
    function RequestObservable(options, body) {
        _super.call(this);
        this.options = options;
        this.body = body;
    }
    RequestObservable.prototype._subscribe = function (subscriber) {
        var subscription = new Rx.Subscription();
        var req = http.request(this.options);
        var s1 = Rx.Observable.fromEvent(req, 'response')
            .first()
            .flatMap(function (res) {
            var data = Rx.Observable.fromEvent(res, 'data');
            var done = Rx.Observable.fromEvent(res, 'end');
            return data.takeUntil(done)
                .reduce(function (body, delta) { return body + delta; }, '')
                .map(function (body) { return ({ body: body, status: res.statusCode, header: res.headers }); });
        })
            .subscribe(subscriber);
        var s2 = Rx.Observable.fromEvent(req, 'error', function (e) { throw e; })
            .subscribe(subscriber);
        subscription.add(s2);
        this.body && req.write(this.body);
        req.end();
        return subscription;
    };
    return RequestObservable;
}(Rx.Observable));
//# sourceMappingURL=index.js.map