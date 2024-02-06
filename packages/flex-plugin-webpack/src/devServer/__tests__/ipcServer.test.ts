import * as webpack from 'webpack';

import * as ipcServerScripts from '../ipcServer';
import ToJsonOutput = webpack.Stats.ToJsonOutput;

describe('ipcServer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should append to queue and process queue on emit', async () => {
    const _processEmitQueue = jest.spyOn(ipcServerScripts, '_processEmitQueue').mockReturnThis();

    // @ts-ignore
    await ipcServerScripts._emitToServer(null, null);

    expect(_processEmitQueue).toHaveBeenCalledTimes(1);
  });

  it('should test emitCompileComplete for a plugin that is not the last to load', async () => {
    const _emitAllCompilesComplete = jest.spyOn(ipcServerScripts, 'emitAllCompilesComplete').mockReturnThis();
    const _emitToServer = jest.spyOn(ipcServerScripts, '_emitToServer').mockReturnThis();

    const payload = { result: {} as ToJsonOutput, appName: 'test', lastPluginBundle: false };
    await ipcServerScripts.emitCompileComplete(payload);

    expect(_emitToServer).toHaveBeenCalledTimes(1);
    expect(_emitToServer).toHaveBeenCalledWith(ipcServerScripts.IPCType.onCompileComplete, payload);
    expect(_emitAllCompilesComplete).not.toHaveBeenCalled();
  });

  it('should test emitCompileComplete for a plugin that is the last to load', async () => {
    const _emitAllCompilesComplete = jest.spyOn(ipcServerScripts, 'emitAllCompilesComplete').mockReturnThis();
    const _emitToServer = jest.spyOn(ipcServerScripts, '_emitToServer').mockReturnThis();

    const payload = { result: {} as ToJsonOutput, appName: 'test', lastPluginBundle: true };
    await ipcServerScripts.emitCompileComplete(payload);

    expect(_emitToServer).toHaveBeenCalledTimes(1);
    expect(_emitToServer).toHaveBeenCalledWith(ipcServerScripts.IPCType.onCompileComplete, payload);
    expect(_emitAllCompilesComplete).toHaveBeenCalledTimes(1);
  });

  it('should test emitDevServerCrashed', async () => {
    const _emitToServer = jest.spyOn(ipcServerScripts, '_emitToServer').mockReturnThis();

    const err = new Error('some-error');
    const payload = {
      exception: {
        message: 'some-error',
        stack: expect.any(String),
      },
    };
    await ipcServerScripts.emitDevServerCrashed(err);

    expect(_emitToServer).toHaveBeenCalledTimes(1);
    expect(_emitToServer).toHaveBeenCalledWith(ipcServerScripts.IPCType.onDevServerCrashed, payload);
  });

  it('should process queue on client connect', async () => {
    const _processEmitQueue = jest.spyOn(ipcServerScripts, '_processEmitQueue').mockReturnThis();

    await ipcServerScripts._onClientConnected();
    expect(_processEmitQueue).toHaveBeenCalledTimes(1);
  });
});
