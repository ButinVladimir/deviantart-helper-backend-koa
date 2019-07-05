import { Worker } from 'worker_threads';
// import { createServer } from 'https';
// import { readFileSync } from 'fs';
import { join } from 'path';
import { MongoClient } from 'mongodb';
import getConfig from './get-config';
import createApplication from './create-application';
import { output, outputError } from './helper';

const config = getConfig();
const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.dbConfig.dbName);

    const schedulerWorker = new Worker(join(__dirname, 'index-scheduler.js'));

    const app = createApplication(db, schedulerWorker, config);
    app.listen(config.serverConfig.port, () => {
      output('Server is running');
    });
    // createServer({
    //   cert: readFileSync(join(__dirname, '..', 'certificates', 'dahelper.crt')),
    //   key: readFileSync(join(__dirname, '..', 'certificates', 'dahelper.key')),
    // }, app.callback())
    //   .listen(config.serverConfig.port, () => {
    //     output('Server is running');
    //   });
  }).catch((e) => {
    outputError(e);
  });
