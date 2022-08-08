/* eslint-disable camelcase */
import { FlexPluginError } from '@twilio/flex-dev-utils';
import * as fsScript from '@twilio/flex-dev-utils/dist/fs';

import { Visibility } from '../../clients';
import * as listScript from '../list';

jest.mock('../../prints/pluginVersions');
jest.mock('../../utils/runtime');
jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/credentials');

/* eslint-disable */
const getRuntime = require('../../utils/runtime').default;
const pluginVersions = require('../../prints/pluginVersions').default;
/* eslint-enable */

describe('list', () => {
  const twilUrl = 'test.twil.io';
  const privateOnly = '--private-only';
  const paths = {
    app: {
      name: 'plugin-test',
    },
  };

  process.env.TWILIO_API_KEY = 'SK00000000000000000000000000000000';
  process.env.TWILIO_API_SECRET = 'abc123';

  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    jest.spyOn(fsScript, 'getPaths').mockReturnValue(paths);
  });

  describe('main script', () => {
    // @ts-ignore
    const doList = jest.spyOn(listScript, '_doList').mockImplementation(() => {
      /* no-op */
    });

    afterAll(() => {
      doList.mockRestore();
    });

    it('should quit if both --public-only and --private-only is provided', async (done) => {
      try {
        await listScript.default('--public-only', privateOnly);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('cannot use --public-only');
        expect(e.message).toContain(privateOnly);
        done();
      }
    });

    it('should call doList with both public and private', async () => {
      await listScript.default();

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith([Visibility.Public, Visibility.Protected], 'asc');
    });

    it('should call doList as public', async () => {
      await listScript.default('--public-only');

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith([Visibility.Public], 'asc');
    });

    it('should call doList as public', async () => {
      await listScript.default(privateOnly);

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith([Visibility.Protected], 'asc');
    });

    it('should call doList in desc', async () => {
      await listScript.default('--desc');

      expect(doList).toHaveBeenCalledTimes(1);
      expect(doList).toHaveBeenCalledWith([Visibility.Public, Visibility.Protected], 'desc');
    });
  });

  describe('_doList', () => {
    // @ts-ignore
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => {
      /* no-op */
    });
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
        // eslint-disable-next-line camelcase
        environment: { domain_name: twilUrl },
        // eslint-disable-next-line camelcase
        build: { asset_versions: assetVersions },
      }));
    });

    afterAll(() => {
      exit.mockRestore();
    });

    it('should not print anything if there is no build', async () => {
      getRuntime.mockImplementation(() => ({}));

      await listScript._doList([]);

      expect(pluginVersions).not.toHaveBeenCalled();
    });

    it('should not print table if assets is empty', async () => {
      getRuntime.mockImplementation(() => ({
        // eslint-disable-next-line camelcase
        build: { asset_versions: [] },
      }));

      await listScript._doList([]);

      expect(pluginVersions).not.toHaveBeenCalled();
    });

    it('should filter out plugin-test only', async () => {
      await listScript._doList([Visibility.Public, Visibility.Protected]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith(twilUrl, [publicVersion, privateVersion], 'asc');
    });

    it('should filter out plugin-test only in desc', async () => {
      await listScript._doList([Visibility.Public, Visibility.Protected], 'desc');

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith(twilUrl, [publicVersion, privateVersion], 'desc');
    });

    it('should filter out public plugin-test ', async () => {
      await listScript._doList([Visibility.Public]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith(twilUrl, [publicVersion], 'asc');
    });

    it('should filter out private plugin-test ', async () => {
      await listScript._doList([Visibility.Protected]);

      expect(pluginVersions).toHaveBeenCalledTimes(1);
      expect(pluginVersions).toHaveBeenCalledWith(twilUrl, [privateVersion], 'asc');
    });
  });
});
