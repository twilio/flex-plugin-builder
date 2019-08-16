import index from '../index';
import { logger } from 'flex-dev-utils';
import { render as markedRender } from 'flex-dev-utils/dist/marked';

jest.mock('flex-dev-utils/dist/spawn');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/marked');

// tslint:disable
const spawn = require('flex-dev-utils').spawn;
// tslint:enable

describe('index', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  // @ts-ignore
  logger.colors.blue = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    delete require.cache[require.resolve('../index')];
  });

  const assertSpawn = (args: string[]) => {
    expect(spawn).toHaveBeenCalledWith('node', args);
  };

  it('should quit if unknown script is requested', async () => {
    await index();

    expect(spawn).not.toHaveBeenCalled();
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unknown script'));
  });

  it('should run main script', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([expect.stringContaining('build'), expect.anything()]);
  });

  it('should run main script and pass other args', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build', 'foo');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([expect.stringContaining('build'), 'foo', expect.anything()]);
  });

  it('should set no-versioning', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(spawn).toHaveBeenCalledTimes(1);
    assertSpawn([expect.anything(), '--disallow-versioning']);
  });

  it('should render doc', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await index('build', '--help');

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
    expect(spawn).not.toHaveBeenCalled();
    expect(markedRender).toHaveBeenCalledTimes(1);
  });
});
