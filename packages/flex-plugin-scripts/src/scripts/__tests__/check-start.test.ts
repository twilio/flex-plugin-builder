import fs from 'fs';
import { logger } from 'flex-dev-utils';

import * as checkStartScript from '../check-start';

jest.mock('flex-dev-utils/dist/logger');

describe('check-start', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('quit if no appConfig is found', async () => {
    const existSync = jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(false);
    const copyFileSync = jest
      .spyOn(fs, 'copyFileSync');

    await checkStartScript.default();

    expect(existSync).toHaveBeenCalledTimes(1);
    expect(existSync).toHaveBeenCalledWith(expect.stringContaining('appConfig.js'));
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Could not find'));
    expect(copyFileSync).not.toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);

    existSync.mockRestore();
    copyFileSync.mockRestore();
  });

  it('quit if copying file fails', async () => {
    const existSync = jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true);
    const copyFileSync = jest
      .spyOn(fs, 'copyFileSync')
      .mockImplementation(() => {
        throw new Error('asd');
      });

    await checkStartScript.default();

    expect(copyFileSync).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to copy'));
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);

    existSync.mockRestore();
    copyFileSync.mockRestore();
  });

  it('should successfully check', async () => {
    const existSync = jest
      .spyOn(fs, 'existsSync')
      .mockReturnValue(true);
    const copyFileSync = jest
      .spyOn(fs, 'copyFileSync')
      .mockImplementation(() => { /* no-op */ });

    await checkStartScript.default();

    expect(copyFileSync).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();

    existSync.mockRestore();
  });
});
