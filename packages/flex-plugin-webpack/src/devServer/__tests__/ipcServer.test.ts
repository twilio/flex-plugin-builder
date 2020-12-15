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

  it('should test emitCompileComplete', async () => {
    const _emitToServer = jest.spyOn(ipcServerScripts, '_emitToServer').mockReturnThis();

    const payload = { result: {} as ToJsonOutput, appName: 'test' };
    await ipcServerScripts.emitCompileComplete(payload);

    expect(_emitToServer).toHaveBeenCalledTimes(1);
    expect(_emitToServer).toHaveBeenCalledWith(ipcServerScripts.IPCType.onCompileComplete, payload);
  });

  it('should process queue on client connect', async () => {
    const _processEmitQueue = jest.spyOn(ipcServerScripts, '_processEmitQueue').mockReturnThis();

    await ipcServerScripts._onClientConnected();
    expect(_processEmitQueue).toHaveBeenCalledTimes(1);
  });
});
