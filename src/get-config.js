import { join } from 'path';
import { readFileSync } from 'fs';
import Config from './config/config';

export default () => new Config(JSON.parse(readFileSync(join(__dirname, '..', 'config', 'config.json'))));
