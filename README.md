# node-rx-http

[![NPM](https://nodei.co/npm/node-rx-http.png)](https://nodei.co/npm/node-rx-http/)

A simple RxJS wrapper for the node http module

### Quick Start

```bash
$ npm install --save node-rx-http
```

#### Usage

```javascript

var RxHttp = require('node-rx-http');

RxHttp.get('http://www.google.com')
  .filter(x => x.statusCode)
  .map(x => JSON.parse(x.body))
  .subscribe(body => {
    console.log(body.data);
  });

```
