import index from '../index';
import { logger } from 'flex-dev-utils';
import { render as markedRender } from 'flex-dev-utils/dist/marked';
import spawn from '../utils/spawn';

jest.mock('../utils/spawn');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/marked');

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

  it('should quit if unknown script is requested', () => {
    index();
    expect(spawn).not.toHaveBeenCalled();
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Unknown script'));
  });

  it('should run main script', () => {
    index('build');
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith([expect.stringContaining('build'), expect.anything()]);
  });

  it('should run main script and pass other args', () => {
    index('build', 'foo');
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith([expect.stringContaining('build'), 'foo', expect.anything()]);
  });

  it('should set no-versioning', () => {
    index('build');
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith([expect.anything(), '--disallow-versioning']);
  });

  it('should render doc', () => {
    index('build', '--help');
    expect(spawn).not.toHaveBeenCalled();
    expect(markedRender).toHaveBeenCalledTimes(1);
  });
});
