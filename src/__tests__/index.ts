import RxHttp from '../index';
const nock = require('nock');

describe('request', function () {
  describe('get', function () {

    beforeEach(function () {
      nock('http://example.com').get('/safe').reply(200, 'Safe!');
      nock('http://example.com').get('/error').reply(401, 'Error!');
    });

    it('should forward errors to the handler', function (done) {
      RxHttp.get('http://example.com/error').subscribe(
        x => {
          expect(x.statusCode).toEqual(401);
          expect(x.body).toEqual('Error!');
        },
        done,
        done
      );
    });

    it('should return 200 on success', function (done) {
      RxHttp.get('http://example.com/safe').subscribe(x => {
        expect(x.statusCode).toEqual(200);
      }, done, done);
    });
  });

  describe('post', function() {

  })



});

