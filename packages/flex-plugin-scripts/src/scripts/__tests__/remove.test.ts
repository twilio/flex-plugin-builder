import * as removeScript from '../remove';

import { logger } from 'flex-dev-utils';
import * as inquirer from 'flex-dev-utils/dist/inquirer';

jest.mock('../../clients/environments');
jest.mock('inquirer');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/credentials', () => ({
  getCredential: jest.fn(),
}));
jest.mock('../../utils/paths', () => ({
  packageName: 'plugin-test',
}));

// tslint:disable
const EnvironmentClient = require('../../clients/environments').default;
// tslint:enable

describe('remove', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });
  // @ts-ignore
  logger.colors.blue = jest.fn();

  const service = { sid: 'ZSxxx' };
  const environment = { sid: 'ZSxxx' };
  const runtime = { service, environment };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('default', () => {
    const doRemove = jest.spyOn(removeScript, '_doRemove').mockResolvedValue();

    afterAll(() => {
      doRemove.mockRestore();
    });

    it('should quit if confirmation is rejected', async () => {
      const confirm = jest.spyOn(inquirer, 'confirm').mockResolvedValue(false);

      await removeScript.default();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(0);
      expect(doRemove).not.toHaveBeenCalled();
    });

    it('should doRemove if confirmed', async () => {
      const confirm = jest.spyOn(inquirer, 'confirm').mockResolvedValue(true);

      await removeScript.default();

      expect(confirm).toHaveBeenCalledTimes(1);
      expect(exit).not.toHaveBeenCalled();
      expect(doRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('_doRemove', () => {
    it('should remove environment', async () => {
      // @ts-ignore
      const _getRuntime = jest.spyOn(removeScript, '_getRuntime').mockResolvedValue(runtime);
      const remove = jest.fn();
      EnvironmentClient.mockImplementation(() => ({ remove }));

      await removeScript._doRemove();

      expect(_getRuntime).toHaveBeenCalledTimes(1);
      expect(remove).toHaveBeenCalledTimes(1);
      expect(remove).toHaveBeenCalledWith(environment.sid);
      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(0);

      _getRuntime.mockRestore();
    });
  });
});
