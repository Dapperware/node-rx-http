var RxHttp = require('../index');
var nock = require('nock');
var expect = require('chai').expect;

describe('request', function () {
  describe('get', function () {

    beforeEach(function () {
      nock('http://example.com').get('/safe').reply(200, 'Safe!');
      nock('http://example.com').get('/error').reply(401, 'Error!');
    });

    it('should forward errors to the handler', function (done) {
      RxHttp.get('http://example.com/error').subscribe(
        x => {
          expect(x.statusCode).to.equal(401);
          expect(x.body).to.equal('Error!');
        },
        done,
        done
      );
    });

    it('should return 200 on success', function (done) {
      RxHttp.get('http://example.com/safe').subscribe(x => {
        expect(x.statusCode).to.equal(200);
      }, done, done);
    });
  });



});

