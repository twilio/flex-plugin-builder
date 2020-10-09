import '@babel/polyfill';
import { EventEmitter } from 'events';

if (!process.env.CI) {
  EventEmitter.defaultMaxListeners = 15;
}

