import { readConfig } from './config';
import path from 'path';
console.log(path.resolve(__dirname))
readConfig(path.resolve(__dirname))