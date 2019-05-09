import { Worker } from 'worker_threads';
import { join } from 'path';
import { MongoClient } from 'mongodb';
import config from './config';
import createApplication from './create-application';

const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.dbConfig.dbName);

    let schedulerWorker = null;
    if (config.schedulerConfig.startBundled) {
      schedulerWorker = new Worker(join(__dirname, 'index-scheduler.js'));
    }

    createApplication(db, schedulerWorker, config)
      .listen(config.serverConfig.port, () => {
        console.debug('Server is running');
      });
  }).catch((e) => {
    console.error(e);
  });
