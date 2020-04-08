import * as fs from 'flex-dev-utils/dist/fs';

jest.mock('flex-dev-utils/dist/logger');

describe('paths', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  const validPackage = {
    name: 'plugin-test',
    version: '1.2.3',
    dependencies: {
      'flex-plugin-scripts': '1',
      'flex-plugin': '2'
    },
  };

  it('should give you the paths', () => {
    const readPackageJson = jest
      .spyOn(fs, 'readPackageJson')
      .mockReturnValue(validPackage);

    const paths = require('../paths').default;

    expect(readPackageJson).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();

    // build/ directory
    expect(paths.buildDir).toEqual(expect.stringMatching('build$'));
    expect(paths.bundlePath).toContain('build');
    expect(paths.bundlePath).toContain(validPackage.name);
    expect(paths.bundlePath).toEqual(expect.stringMatching('\.js$'));
    expect(paths.sourceMapPath).toContain('build');
    expect(paths.sourceMapPath).toContain(validPackage.name);
    expect(paths.sourceMapPath).toEqual(expect.stringMatching('\.js\.map$'));

    // src/ directory
    expect(paths.srcDir).toEqual(expect.stringMatching('src$'));
    expect(paths.entryPath).toContain('src');
    expect(paths.entryPath).toEqual(expect.stringMatching('index$'));

    // node_modules/ directory
    expect(paths.nodeModulesDir).toEqual(expect.stringMatching('node_modules$'));
    expect(paths.flexUIDir).toContain('node_modules');
    expect(paths.flexUIDir).toContain('@twilio/flex-ui');
    expect(paths.flexUIPkgPath).toContain('@twilio/flex-ui');
    expect(paths.flexUIPkgPath).toEqual(expect.stringMatching('package\.json$'));
    expect(paths.devAssetsDir).toContain('flex-plugin-scripts');

    // public/ directory
    expect(paths.publicDir).toEqual(expect.stringMatching('public$'));
    expect(paths.indexHtmlPath).toEqual(expect.stringMatching('index\.html$'));
    expect(paths.appConfig).toEqual(expect.stringMatching('appConfig\.js$'));
    expect(paths.pluginsJsonPath).toEqual(expect.stringMatching('plugins\.json$'));

    // package.json
    expect(paths.packageName).toEqual('plugin-test');
    expect(paths.version).toEqual('1.2.3');

    // others
    expect(paths.assetBaseUrlTemplate).toContain('plugin-test/%PLUGIN_VERSION%');

    readPackageJson.mockRestore();
  });
});
