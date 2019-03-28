import { MongoClient } from 'mongodb';
import config from './config';
import createApplication from './create-application';
import createScheduler from './create-scheduler';

const dbClient = new MongoClient(config.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.db);

    createApplication(db, config).listen(config.port);
    createScheduler(db, config).start();
  }).catch((e) => {
    console.error(e);
  });
