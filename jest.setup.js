import '@babel/polyfill';
import { EventEmitter } from 'events';

EventEmitter.defaultMaxListeners = 30;
