## KnowledgeGraph testing guide

The testing environment is built using Jest. On MVP phase, the program has some unit tests and API tests. It is recommended to extend test coverage during later development.

Tests can be found from tests directory under app directory.

The Jest documentation and other relevant information can be found from Jest homepage https://jestjs.io/.

## How to run all tests

First of all, it is necessary to run `npm install` on app folder to install modules needed for running the tests.

The script to run tests is configured on package.json file. At the moment, the configured script is

```json
"test": "jest",
```

The command `jest` will find all files with suffix .test.js/ts and .spec.ts/js from app folder and run them. So, to run all tests run command

```
npm test
```

on terminal from app folder.

## Adding command line parameters

It is possible to run tests with many different handles, e.g. run only one test, run tests on watch mode etc. To give command line arguments, the command to be run should be

```
npm test -- --argument
```

where argument is some argument you want to use. For example, if you want to disable stack trace printing, the command would be

```
npm test -- --noStackTrace
```

All command line parameters can be found from https://archive.jestjs.io/docs/en/cli.
