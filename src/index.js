import { Worker } from 'worker_threads';
import { join } from 'path';
import { MongoClient } from 'mongodb';
import config from './config';
import createApplication from './create-application';
import { output, outputError } from './helper';

const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.dbConfig.dbName);

    const schedulerWorker = new Worker(join(__dirname, 'index-scheduler.js'));

    createApplication(db, schedulerWorker, config)
      .listen(config.serverConfig.port, () => {
        output('Server is running');
      });
  }).catch((e) => {
    outputError(e);
  });
