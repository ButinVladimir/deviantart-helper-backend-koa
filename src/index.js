import { MongoClient } from 'mongodb';
import config from './config';
import application from './application';

const dbClient = new MongoClient(config.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.db);
    application(db, config).listen(config.port);
  }).catch((e) => {
    console.error(e);
  });
