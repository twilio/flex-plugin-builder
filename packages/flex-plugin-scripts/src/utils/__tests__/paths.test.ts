import * as fs from 'flex-dev-utils/dist/fs';

describe('paths', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  const validPackage = {
    name: 'plugin-test',
    version: '1.2.3',
    dependencies: {
      'flex-plugin-scripts': '1',
      'flex-plugin': '2',
      'craco-config-flex-plugin': '3',
    },
  };

  it('should give you the paths', () => {
    const readPackageJson = jest
      .spyOn(fs, 'readPackageJson')
      .mockReturnValue(validPackage);

    const paths = require('../paths').default;

    expect(readPackageJson).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();
    expect(paths.packageName).toEqual('plugin-test');
    expect(paths.version).toEqual('1.2.3');
    expect(paths.buildDir).toContain('build');
    expect(paths.localBundlePath).toContain('build/plugin-test.js');
    expect(paths.localSourceMapPath).toContain('build/plugin-test.js.map');
    expect(paths.appConfig).toContain('public/appConfig.js');
    expect(paths.assetBaseUrlTemplate).toContain('plugin-test/%PLUGIN_VERSION%');

    readPackageJson.mockRestore();
  });
});
