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

RxHttp.get('http://www.google.com')
  .filter(x => x.statusCode)
  .map(x => JSON.parse(x.body))
  .subscribe(body => {
    console.log(body.data);
  });

```
