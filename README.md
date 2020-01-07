# DeviantART Helper

This project is the MVP of backend part of [DeviantART Helper](https://bitbucket.org/VladimirButin/deviantart-helper-backend-koa).

Tests in this project are not finished due to upcoming refactoring which probably will never happen.

Main repository can be found on [BitBucket](https://bitbucket.org/VladimirButin/deviantart-helper-backend-koa).<br>
Mirror repository is available on [GitHub](https://github.com/ButinVladimir/deviantart-helper-backend-koa).

Project uses [DeviantART](https://www.deviantart.com/developers/) API and requires to have working account there.

Project uses MongoDB as DB storage.

Backend part consists of server and scheduler.<br>
Server serves frontend files and calculates user statistics.<br>
Scheduler uses DeviantART API to update user data such as deviations.

## Installation

First, `npm install` should be ran first to fetch npm modules.<br>
Next, `/config/config.json` file should be created. Refer to the `config.example.json` <br>
and Config section to properly set config.<br>
After this, run `npm run build` to prepare build files.<br>
Finally, frontend files should be added to the `public` folder.

## Usage

To run server, use `npm start` command. To fetch data automatically, use any<br>
scheduler such as cron for Linux to run script `npm run fetch` periodically.

Currently, Helper can do following:

- Display common user info
- Browse user deviations
- Display sum of deviations statistics such as total amount of views, favs, etc. in set period of time.
- Display detailed deviations statistics
- Display how deviations statistics changed by time via charts.

## Available Scripts

### `npm start`

Alias for `npm run serve:app`.

### `npm run build`

Script to convert source files using [Babel](https://github.com/babel/babel).

### `npm run build:watch`

Script to run Babel in watch mode.

### `npm run serve:app`

Starts server and scheduler using [Nodemon](https://github.com/remy/nodemon).

### `npm run serve:scheduler`

Starts scheduler using [Nodemon](https://github.com/remy/nodemon).

### `npm run fetch`

Added task to scheduler to fetch DeviantART data for every registered user.

### `npm test`

Launches the Jest test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:staged`

Script for [Husky](https://github.com/typicode/husky) to run related tests for staged changes.

### `npm run coverage`

Runs Jets test runner in the coverage mode.

## Development

Development server can be started by running `npm start` script.

To avoid rebuilding source files manually, `npm run build:watch` script can be used.

Codestyle is enforced by [Eslint](https://github.com/eslint/eslint).

Unit tests are written with [Jest](https://github.com/facebook/jest).

Test coverage can be obtained by running `npm run coverage` and<br>
then checking console or `coverage` folder.

Codestyle and unit tests are checked automatically during commit by [Husky](https://github.com/typicode/husky).

## Config

Example of config file can be found at `/config/config.example.json`.<br>
App uses `/config/config.json`.

### server

#### port

On which part server will run.

#### cookieKey

Cookie key for security. Should be unique and secret.

#### staticMaxAge

For how long static files can be cached in milliseconds.<br>
By default it is 1 day.

### db

#### connectionString

Connection string to MongoDB database.

#### dbName

Database name.

### oauth

#### key 

OAUTH key required by DeviantART API.

#### secret 

OAUTH secret required by DeviantART API.

#### tokenKey 

String used to encrypt user tokens.

#### callbackUri

Callback URI required by DeviantART API. Should look like `[host]/auth/connect/deviantart/callback`.

#### redirectUri

Redirect URI required by DeviantART API. Should look like `[host]`.

#### accessTokenWindow

For how many milliseconds access token from DeviantART API is active.<br>
By default it is 50 minutes to avoid problems with calling API when access token is expired.

#### refreshTokenWindow

For how many milliseconds refresh token from DeviantART API is active.<br>
By default it is 80 days to avoid problems with calling API when refresh token is expired.

### scheduler

#### readOnly

If set to `true`, user cannot request data fetch by themselves to update data manually.<br>
Is `false` by default.

#### maxAttempts

How many attempts scheduler can do to retrieve data before throwing an error.

#### minDelay

Minimal delay between running scheduler tasks.

#### maxDelay

Maximal delay between running scheduler tasks.

#### successDelayCoefficient

If last task was a success, delay will be multiplied by this coefficient.<br>
It is necessary to shorten delay if there are no problems with API.

#### failureDelayCoefficient

If last task was a failure, delay will be multiplied by this coefficient.<br>
It is necessary to extend delay if requests are occuring too often or API is down.

#### fetchDataWindow

How many milliseconds should pass to allow user fetch data either way.<br>
By default it is 1 minute to prevent DOSing.

#### requestFetchDataWindow

How many milliseconds should pass to allow user fetch data manually.<br>
By default it is 2 minutes to prevent DOSing.

### api

#### limitDeviations

How many deviations can be retrieved by using DeviantART API per task.<br>
Cannot be more than 20.

#### limitDeviationsMetadata

For how many deviations metadata can be retrieved by using DeviantART API per task.<br>
Cannot be more than 10.

### dao

#### limitDeviationsBrowse

How many deviations can be displayed on same page on Browse Deviations page.

#### limitDeviationsStatistics

How many deviations can be displayed on same page on Deviations Statistics page.

### rateLimit

#### interval

Interval window for [ratelimit](https://github.com/ysocorp/koa2-ratelimit).<br>
By default is 1 minute.

#### max

How many requests per window are allowed.

#### delayAfter

Start delay responses after set amount of requests.<br>
By default is 50 requests.

#### timeWait

When responses are slowed, how long will be delay between requests.<br>
By default is 1 second.

### environment

Which environment is currently used, `development` or `production`.

## Performance

To increase performance, indexes to MongoDB can be added.<br>
In example, DB is called `dahelper`. Run this in Mongo console:

```
use dahelper
db.deviations_metadata.createIndex({ "eid": 1, "ts": -1 })
```