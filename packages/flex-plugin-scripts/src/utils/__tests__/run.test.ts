import { logger, FlexPluginError } from 'flex-dev-utils';
import * as run from '../run';

jest.mock('flex-dev-utils/dist/logger');

describe('run', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  describe('exit', () => {
    it('should not quit if arg has the flag', () => {
      run.exit(123, ['--no-process-exit']);

      expect(exit).not.toHaveBeenCalled();
    });

    it('should quit by default', () => {
      run.exit(123);

      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(123);
    });
  });
});
