import ipc from 'node-ipc';
import { env, logger } from 'flex-dev-utils';
import webpack from 'webpack';

import ToJsonOutput = webpack.Stats.ToJsonOutput;

interface Client {
  on(event: string, callback: (...args: any[]) => void): Client;
  emit(event: string, value?: any): Client;
}

export enum IPCType {
  onCompileComplete = 'onCompileComplete',
}

export interface OnCompileCompletePayload {
  result: ToJsonOutput;
  appName: string;
}

export interface IPCPayload {
  onCompileComplete: OnCompileCompletePayload;
}

type MessageCallback<T extends IPCType> = (payload: IPCPayload[T]) => void;
type MessageCallbacks = { [key in IPCType]?: MessageCallback<key>[] };

ipc.config.id = 'twilio.flex.plugin-builder';
ipc.config.retry = 1500;
ipc.config.silent = !env.isDebug();

let _isServerRunning: boolean = false;
let _isClientConnected: boolean = false;
/* istanbul ignore next */
export const isServerRunning = (): boolean => _isServerRunning;
/* istanbul ignore next */
export const isClientConnected = (): boolean => _isClientConnected;

let clientNode: Client | null = null;
const messageCallbacks: MessageCallbacks = {};

/*
 * This is used only to set the type of this queue
 * This is the only way to get dynamic typing in TS :(
 */
const getEmitItem = <T extends IPCType>(type?: T, payload?: IPCPayload[T]) => ({ type, payload });
const emitQueue = [getEmitItem()].slice(1);

/**
 * Processes the emit queue
 * @private
 */
/* istanbul ignore next */
export const _processEmitQueue = async (): Promise<void> => {
  if (!isClientConnected()) {
    return;
  }

  while (emitQueue.length) {
    (clientNode as Client).emit('message', emitQueue.pop());
  }
};

/**
 * Processes the on server message
 * @param data
 * @private
 */
export const _onServerMessage = (data: { payload: unknown; type: string }): void => {
  if (!data.type) {
    logger.error('IPC got an unexpected message: ', data);
    return;
  }

  Object.keys(messageCallbacks).forEach((type) => {
    if (messageCallbacks[type as IPCType]) {
      messageCallbacks[type as IPCType]?.forEach((cb: MessageCallback<any>) => cb(data.payload));
    }
  });
};

/**
 * Processes on client connected
 * @private
 */
export const _onClientConnected = async (): Promise<void> => {
  _isClientConnected = true;
  await _processEmitQueue();
};

/**
 * Emits to the server
 * @param type      the event type
 * @param payload   the event payload
 * @private
 */
export const _emitToServer = async <T extends IPCType>(type: T, payload: IPCPayload[T]): Promise<void> => {
  emitQueue.push({ type, payload });
  await _processEmitQueue();
};

/**
 * Starts an IPC server
 */
export const startIPCServer = (): void => {
  if (isServerRunning()) {
    return;
  }

  ipc.serve(() => ipc.server.on('message', _onServerMessage));
  ipc.server.start();

  _isServerRunning = true;
};

/**
 * Starts an IPC Client
 */
export const startIPCClient = (): void => {
  if (isClientConnected()) {
    return;
  }

  ipc.connectTo(ipc.config.id, () => {
    clientNode = ipc.of[ipc.config.id] as Client;
    clientNode.on('connect', _onClientConnected);
  });
};

/**
 * onMessage event for the IPC server
 * @param type
 * @param callback
 */
/* istanbul ignore next */
export const onIPCServerMessage = <T extends IPCType>(type: T, callback: MessageCallback<T>): void => {
  if (!(type in messageCallbacks)) {
    messageCallbacks[type as IPCType] = [];
  }
  // @ts-ignore
  messageCallbacks[type].push(callback);
};

/**
 * Emits a compilation complete event
 * @param payload
 */
export const emitCompileComplete = async (payload: OnCompileCompletePayload): Promise<void> =>
  _emitToServer(IPCType.onCompileComplete, payload);
