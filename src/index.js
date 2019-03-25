import config from './config';
import application from './application';

application(config).then(app => app.listen(config.port));
