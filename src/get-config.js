import { join } from 'path';
import { readFileSync } from 'fs';
import Config from './config/config';

export default () => new Config(JSON.parse(readFileSync(join(process.cwd(), 'config', 'config.json'))));
