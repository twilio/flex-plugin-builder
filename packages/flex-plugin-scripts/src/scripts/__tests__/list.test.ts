import { Visibility } from '../../clients/serverless-types';
import * as listScript from '../list';

jest.mock('../../prints/pluginVersions');
jest.mock('../../utils/runtime');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../utils/paths', () => ({
  packageName: 'plugin-test',
}));

// tslint:disable
const getRuntime = require('../../utils/runtime').default;
const pluginVersions = require('../../prints/pluginVersions').default;
// tslint:enable

describe('list', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  process.env.ACCOUNT_SID = 'ACxxx';
  process.env.AUTH_TOKEN = 'abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('main script', () => {
    // @ts-ignore
    const doList = jest.spyOn(listScript, '_doList').mockImplementation(() => { /* no-op */ });

    afterAll(() => {
      doList.mockRestore();
    });

    it('should quit if both --public-only and --private-only is provided', () => {
      listScript.default('--public-only', '--private-only');

      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should call doList with both public and private', () => {
      listScript.default();

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith(['public', 'protected'], 'asc');
    });

    it('should call doList as public', () => {
      listScript.default('--public-only');

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith(['public'], 'asc');
    });

    it('should call doList as public', () => {
      listScript.default('--private-only');

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith(['protected'], 'asc');
    });

    it('should call doList in desc', () => {
      listScript.default('--desc');

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith(['public', 'protected'], 'desc');
    });
  });

  describe('_doList', () => {
    const publicVersion = {
      path: '/plugins/plugin-test/0.1.0/bundle.js',
      visibility: 'public',
    };
    const privateVersion = {
      path: '/plugins/plugin-test/0.2.0/bundle.js',
      visibility: 'protected',
    };
    const anotherVersion = {
      path: '/plugins/plugin-another/0.1.0/bundle.js',
      visibility: 'public',
    };
    const assetVersions = [publicVersion, privateVersion, anotherVersion];

    beforeEach(() => {
      getRuntime.mockImplementation(() => ({
        environment: { domain_name: 'test.twil.io' },
        build: { asset_versions: assetVersions },
      }));
    });

    it('should not print anything if there is no build', async () => {
      getRuntime.mockImplementation(() => ({}));

      await listScript._doList([]);

      expect(pluginVersions).not.toHaveBeenCalled();
    });

    it('should not print table if assets is empty', async () => {
      getRuntime.mockImplementation(() => ({
        build: { asset_versions: [] },
      }));

      await listScript._doList([]);

      expect(pluginVersions).not.toHaveBeenCalled();
    });

    it('should filter out plugin-test only', async () => {
      await listScript._doList([Visibility.Public, Visibility.Protected]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith('test.twil.io', [publicVersion, privateVersion], 'asc');
    });

    it('should filter out plugin-test only in desc', async () => {
      await listScript._doList([Visibility.Public, Visibility.Protected], 'desc');

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith('test.twil.io', [publicVersion, privateVersion], 'desc');
    });

    it('should filter out public plugin-test ', async () => {
      await listScript._doList([Visibility.Public]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith('test.twil.io', [publicVersion], 'asc');
    });

    it('should filter out private plugin-test ', async () => {
      await listScript._doList([Visibility.Protected]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith('test.twil.io', [privateVersion], 'asc');
    });
  });
});
