import { MongoClient } from 'mongodb';
import config from './config';
import FetchDataAllUsersTaskModelFactory from './models/task/factories/fetch-data-all-users-factory';
import TasksDao from './dao/tasks';

const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then(async (client) => {
    const db = client.db(config.dbConfig.dbName);
    const tasksDao = new TasksDao(db);

    await tasksDao.batchInsert([FetchDataAllUsersTaskModelFactory.createModel()]);

    console.log('Added tasks to fetch data successfully');

    process.exit();
  }).catch((e) => {
    console.error(e);
  });
