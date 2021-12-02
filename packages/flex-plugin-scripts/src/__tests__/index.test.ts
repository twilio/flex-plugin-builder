import { logger } from 'flex-dev-utils';
import * as fsScripts from 'flex-dev-utils/dist/fs';
import * as exit from 'flex-dev-utils/dist/exit';

import index from '..';

jest.mock('flex-dev-utils/dist/spawn');
jest.mock('flex-dev-utils/dist/logger');

/* eslint-disable */
const { spawn } = require('flex-dev-utils/dist/spawn');
/* eslint-enable */

describe('index', () => {
  const disallowVersioningFlag = '--disallow-versioning';
  const runFlag = '--run-script';
  const runExit = jest.spyOn(exit, 'default').mockReturnValue();

  // @ts-ignore
  logger.colors.blue = jest.fn();
  const pluginName = 'plugin-test';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue({ app: { name: pluginName } });
    jest.spyOn(fsScripts, 'getCwd').mockReturnValue(`/home/user/plugins/${pluginName}`);

    delete require.cache[require.resolve('../index')];
  });

  const assertSpawn = (args: string[]) => {
    expect(spawn).toHaveBeenCalledWith('node', args);
  };

  it('should quit if unknown script is requested', async () => {
    await index();

    expect(spawn).not.toHaveBeenCalled();
    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unknown script'));
  });

  it('should run main script', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');

    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(0, ['build']);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([expect.stringContaining('build'), disallowVersioningFlag, '--name', pluginName, runFlag]);
  });

  it('should run main script and pass other args', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build', 'foo');

    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(0, ['build', 'foo']);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([expect.stringContaining('build'), 'foo', disallowVersioningFlag, '--name', pluginName, runFlag]);
  });

  it('should call exit', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');
    expect(runExit).toHaveBeenCalledTimes(1);
  });
});
