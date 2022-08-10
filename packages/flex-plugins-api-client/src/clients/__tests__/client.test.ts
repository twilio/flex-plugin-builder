import { HttpClient } from '@twilio/flex-dev-utils';

import PluginServiceHttp from '../client';

jest.mock('@twilio/flex-dev-utils/dist/http');
jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('PluginServiceHttp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../../../package.json');
    const packages = {
      [pkg.name]: pkg.version,
    };

    it('should pass caller', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password', { caller: 'test-caller' });

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ caller: 'test-caller', supportProxy: true }));
    });

    it('should pass default caller', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password');

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ caller: '@twilio/flex-plugins-api-client' }));
    });

    it('should pass default packages', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password');

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ packages }));
    });

    it('should pass provided packages', () => {
      const extraPackages = {
        'sample-package': '1.2.3',
        'another-package': '4.5.6',
      };
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password', { packages: extraPackages });

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ packages: { ...packages, ...extraPackages } }));
    });
  });
});
