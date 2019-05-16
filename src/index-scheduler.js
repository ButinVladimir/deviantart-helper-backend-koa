import { MongoClient } from 'mongodb';
import { parentPort } from 'worker_threads';
import config from './config';
import createScheduler from './create-scheduler';
import TaskModelBaseFactory from './models/task/base-factory';
import { output, outputError } from './helper';

const dbClient = new MongoClient(config.dbConfig.connectionString, {
  useNewUrlParser: true,
});

dbClient
  .connect()
  .then((client) => {
    const db = client.db(config.dbConfig.dbName);

    const scheduler = createScheduler(db, config);
    scheduler.start();

    output('Task scheduler is running');

    parentPort.on('message', ({ name, params }) => {
      output(`Received task ${name} from server`);

      const taskModel = TaskModelBaseFactory.createModelRaw(name, params);
      scheduler.addTasks([taskModel]);
    });
  }).catch((e) => {
    outputError(e);
  });
