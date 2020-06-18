import * as startPluginScript from '../start-plugin';
import { FlexPluginError } from 'flex-dev-utils';
import * as fs from 'flex-dev-utils/dist/fs';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/env');
jest.mock('flex-dev-utils/dist/require');

describe('StartPluginScript', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    describe('_updatePluginsUrl', () => {
        const pkg = { name: 'plugin-test' };
        const port = 2345;

        it('should throw an error if plugin not found', (done) => {
          const plugins = [{
            src: 'broken url',
            name: 'plugin-test',
            enabled: true,
          }];

          const requirePackages = jest
            .spyOn(startPluginScript, '_requirePackages')
            .mockReturnValue({ plugins, pkg });

          try {
            startPluginScript._updatePluginsUrl(port);
          } catch (e) {
            expect(e).toBeInstanceOf(FlexPluginError);
            expect(requirePackages).toHaveBeenCalledTimes(1);
            expect(e.message).toContain('find plugin');
            done();
          }
        });

        it('should throw an error if it fails to find local port', (done) => {
          const plugins = [{
            src: 'http://twilio.com/plugin-test.js',
            name: 'plugin-test',
            enabled: true,
          }];

          const requirePackages = jest
            .spyOn(startPluginScript, '_requirePackages')
            .mockReturnValue({ plugins, pkg });

          try {
            startPluginScript._updatePluginsUrl(port);
          } catch (e) {
            expect(e).toBeInstanceOf(FlexPluginError);
            expect(requirePackages).toHaveBeenCalledTimes(1);
            expect(e.message).toContain('local port');
            done();
          }
        });

        it('should update plugins URL', () => {
          const plugins = [{
            src: 'http://localhost:1234/plugin-test.js',
            name: 'plugin-test',
            enabled: true,
          }];

          const requirePackages = jest
            .spyOn(startPluginScript, '_requirePackages')
            .mockReturnValue({ plugins, pkg });
          const writeFileSync = jest
            .spyOn(fs.default, 'writeFileSync')
            .mockReturnValue();

          startPluginScript._updatePluginsUrl(port);

          expect(requirePackages).toHaveBeenCalledTimes(1);
          expect(writeFileSync).toHaveBeenCalledTimes(1);
          expect(plugins[0].src.indexOf(port.toString()) !== -1).toBeTruthy();

          requirePackages.mockRestore();
          writeFileSync.mockRestore();
        });
      });
});