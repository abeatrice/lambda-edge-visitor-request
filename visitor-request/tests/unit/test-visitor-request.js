'use strict';

const app = require('../../app.js');
const expect = require('chai').expect;

let viewerRequestEvent;
let viewerRequestVisitorIdExistsEvent;
const context = {
  "awsRequestId": "705e610a-6205-49ff-8a40-26c973e39e8c"
}

describe('Test Viewer Request', function () {

  beforeEach(function() {
    viewerRequestEvent = {
      "Records": [
        {
          "cf": {
            "request": {
              "headers": {
              }
            }
          }
        }
      ]
    };
    viewerRequestVisitorIdExistsEvent = {
      "Records": [
        {
          "cf": {
            "request": {
              "headers": {
                "cookie": [
                  {
                    "key": "cookie",
                    "value": "visitor_id=8f02391c-505d-1758-a3b3-4fd49e8ecb7d; otherkey=othervalue; otherid=12345678-1234-12345-1234-123456789012;"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  });

  it('returns successful response', () => {
    app.handler(viewerRequestEvent, context, (err, result) => {
      try {
        expect(err).to.not.exist;
        expect(result).to.exist;
        expect(result.headers.cookie).to.be.an('array');
      } catch (error) {
        throw error;
      }
    });
  });

  it('sets cookie visitor_id to awsRequestId when cookie is not set', () => {
    app.handler(viewerRequestEvent, context, (err, result) => {
      try {
        expect(result.headers.cookie).to.eql([{
          key: 'cookie',
          value: 'visitor_id=705e610a-6205-49ff-8a40-26c973e39e8c;'
        }]);
      } catch (error) {
        throw error;
      }
    });
  });

  it('does not alter cookies if visitorId is already set in cookie', () => {
    let originalCookies;
    app.handler(viewerRequestVisitorIdExistsEvent, context, (err, result) => {
      originalCookies = viewerRequestVisitorIdExistsEvent.Records[0].cf.request.headers.cookie[0].value;
      try {
        expect(result.headers.cookie).to.eql([{
          key: 'cookie',
          value: originalCookies
        }]);
      } catch (error) {
        throw error;
      }
    });
  });
});
