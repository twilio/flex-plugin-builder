import index from '../index';
import { logger } from 'flex-dev-utils';
import * as fsScripts from 'flex-dev-utils/dist/fs';
import { render as markedRender } from 'flex-dev-utils/dist/marked';
import * as exit from 'flex-dev-utils/dist/exit';

jest.mock('flex-dev-utils/dist/spawn');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/marked');

// tslint:disable
const spawn = require('flex-dev-utils').spawn;
// tslint:enable

describe('index', () => {
  const runExit = jest.spyOn(exit, 'default').mockReturnValue();

  // @ts-ignore
  logger.colors.blue = jest.fn();
  const pluginName = 'plugin-test';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue({ app: { name: pluginName }});

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
    assertSpawn([
      expect.stringContaining('build'),
      expect.anything(),
      '--name',
      pluginName,
      '--run-script',
    ]);
  });

  it('should run main script and pass other args', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build', 'foo');

    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(0, ['build', 'foo']);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([
      expect.stringContaining('build'),
      'foo',
      expect.anything(),
      '--name',
      pluginName,
      '--run-script',
    ]);
  });

  it('should set no-versioning', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');

    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(0, ['build']);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([
      expect.anything(),
      '--disallow-versioning',
      '--name',
      pluginName,
      '--run-script',
    ]);
  });

  it('should render doc', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build', '--help');

    expect(runExit).toHaveBeenCalledTimes(1);
    expect(runExit).toHaveBeenCalledWith(0);
    expect(spawn).not.toHaveBeenCalled();
    expect(markedRender).toHaveBeenCalledTimes(1);
  });

  it('should call exit', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');
    expect(runExit).toHaveBeenCalledTimes(1);
  });
});
