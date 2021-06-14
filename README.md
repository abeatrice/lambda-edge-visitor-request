# visitor-tracking

## Local Development

use the SAM CLI to invoke the function locally with a test event in the events dir

```bash
$ sam local invoke VisitorTrackingFunction --event events/viewer_request_cookie_exists.json
```

## Tests

Tests are defined in the `tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run tests.

```bash
$ cd visitor-tracking
$ npm install
$ npm run test
```
