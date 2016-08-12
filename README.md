# node-rx-http

[![NPM](https://nodei.co/npm/node-rx-http.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-rx-http/)

[![Build Status](https://travis-ci.org/Dapperware/node-rx-http.svg?branch=master)](https://travis-ci.org/Dapperware/node-rx-http) 
[![codecov](https://codecov.io/gh/Dapperware/node-rx-http/branch/master/graph/badge.svg)](https://codecov.io/gh/Dapperware/node-rx-http)


A simple RxJS wrapper for the node http module

### Quick Start

```bash
$ npm install --save node-rx-http
```

#### Usage

```javascript

var RxHttp = require('node-rx-http');

RxHttp.get('http://personatestuser.org/email')
  .filter(x => x.statusCode === 200)
  .map(x => JSON.parse(x.body))
  .map(x => ({email : x.email, password: x.pass}));

```

Compare this to the normal way of interacting with the native http module

```javascript

//Taken from https://davidwalsh.name/nodejs-http-request
return http.get({
    host: 'personatestuser.org',
    path: '/email'
}, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {

        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        callback({
            email: parsed.email,
             password: parsed.pass
        });
    });
});

```

This also lets us interface nicely with other request libraries. 
Say we are changing tools and we need to strangle out one library for another.

With RxJS this is a breeze, because the source is decoupled from the stream.

```javascript

var rp = require('request-promise');
var Rx = require('rxjs');
var RxHttp = require('node-rx-http');

var source = RxHttp.get('http://personatestuser.org/email');
//Or
var source = Rx.Observable.fromPromise(rp('http://personatestuser.org/email'));

//Processing - either source will work
source
  .filter(x => x.statusCode === 200)
  .map(x => JSON.parse(x.body))
  .map(x => ({email : x.email, password: x.pass}))
  .subscribe(x => doLogin(x.email, x.password));


```
