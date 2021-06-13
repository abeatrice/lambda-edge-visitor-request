'use strict';

const app = require('../../app.js');
const chai = require('chai');
const path = require("path");
const fs = require('fs');
const expect = chai.expect;

//get test event
let event;
fs.readFile(path.resolve(__dirname, "../../../events/viewer_request_event.json"), 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    event = JSON.parse(data);
});

//create test context
const context = {
    "awsRequestId": "705e610a-6205-49ff-8a40-26c973e39e8c"
}

describe('Tests Viwer Request', function () {
    it('returns successful response', () => {
        app.handler(event, context, (err, result) => {
            try {
                expect(err).to.not.exist;
                expect(result).to.exist;
                expect(result.headers.cookie).to.be.an('array');
                expect(result.headers.cookie).to.eql([{
                    key: 'cookie',
                    value: 'visitor_id=705e610a-6205-49ff-8a40-26c973e39e8c;'
                }]);
            } catch (error) {
                throw error;
            }
        });
    });
});
