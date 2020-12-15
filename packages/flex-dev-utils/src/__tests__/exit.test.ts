import exitScript from '../exit';

describe('exit', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
    /* no-op */
  });
  const OLD_ENV = process.env;
  const OLD_ARGV = process.argv;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
    process.argv = [...OLD_ARGV];
  });

  it('should not quit if arg has the flag', () => {
    exitScript(123, ['--no-process-exit']);

    expect(exit).not.toHaveBeenCalled();
  });

  it('should quit by default', () => {
    exitScript(123);

    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(123);
  });
});
