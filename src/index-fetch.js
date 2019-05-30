import { MongoClient } from 'mongodb';
import getConfig from './get-config';
import FetchDataAllUsersTaskModelFactory from './models/task/factories/fetch-data-all-users-factory';
import TasksDao from './dao/tasks';
import { output, outputError } from './helper';

const config = getConfig();
const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then(async (client) => {
    const db = client.db(config.dbConfig.dbName);
    const tasksDao = new TasksDao(db);

    await tasksDao.batchInsert([FetchDataAllUsersTaskModelFactory.createModel()]);

    output('Added tasks to fetch data successfully');

    process.exit();
  }).catch((e) => {
    outputError(e);
  });
