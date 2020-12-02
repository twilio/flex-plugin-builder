import * as pluginBuilderStartScript from 'flex-plugin-scripts/dist/scripts/start';

import { expect, createTest } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';
import { TwilioCliError } from '../../../../exceptions';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsStart);
  const pkg = {
    name: 'plugin-testOne',
    dependencies: {
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const badVersionPkg = {
    name: 'pluginBad',
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '3.9.9',
    },
    devDependencies: {},
  };
  const badPluginsPkg = {
    name: 'fakePlugin',
    devDependencies: {},
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const config = {
    plugins: [
      { name: 'plugin-testOne', dir: 'test-dir', port: 0 },
      { name: 'plugin-testTwo', dir: 'test-dir', port: 0 },
      { name: 'pluginBad', dir: 'test-dir', port: 0 },
    ],
  };

  let findPortAvailablePort = sinon.stub(pluginBuilderStartScript, 'findPortAvailablePort');

  afterEach(() => {
    sinon.restore();

    findPortAvailablePort = sinon.stub(pluginBuilderStartScript, 'findPortAvailablePort');
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsStart.hasOwnProperty('flags')).to.equal(true);
  });

  start()
    .setup((cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'pkg').get(() => pkg);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (cmd) => {
      await cmd.doRun();

      expect(cmd.pluginsConfig).to.equal(config);
      expect(cmd.runScript).to.have.been.calledThrice;
      expect(cmd.runScript).to.have.been.calledWith('start', ['flex', '--name', pkg.name]);
      expect(cmd.runScript).to.have.been.calledWith('pre-start-check', ['--name', pkg.name]);
      expect(cmd.runScript).to.have.been.calledWith('pre-script-check', ['--name', pkg.name]);
      expect(cmd.spawnScript).to.have.been.calledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
    })
    .it('should run start script for the directory plugin');

  start()
    .setup((cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'pkg').get(() => badVersionPkg);
      sinon.stub(cmd, 'pkg').get(() => badVersionPkg);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(badVersionPkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (cmd) => {
      try {
        await cmd.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('is not compatible');
        expect(cmd._flags.name).to.be.undefined;
        expect(cmd._flags['include-remote']).to.be.undefined;
        expect(cmd.runScript).have.been.calledTwice;
        expect(cmd.runScript).to.have.been.calledWith('pre-start-check', ['--name', badVersionPkg.name]);
        expect(cmd.runScript).to.have.been.calledWith('pre-script-check', ['--name', badVersionPkg.name]);
        expect(cmd.spawnScript).not.to.have.been.called;
      }
    })
    .it('should error due to bad versioning');

  start()
    .setup((cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'pkg').get(() => badPluginsPkg);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (cmd) => {
      try {
        await cmd.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('was not found');
        expect(cmd._flags.name).to.be.undefined;
        expect(cmd._flags['include-remote']).to.be.undefined;
        expect(cmd.runScript).have.been.calledTwice;
        expect(cmd.runScript).to.have.been.calledWith('pre-start-check', ['--name', badPluginsPkg.name]);
        expect(cmd.runScript).to.have.been.calledWith('pre-script-check', ['--name', badPluginsPkg.name]);
        expect(cmd.spawnScript).not.to.have.been.called;
      }
    })
    .it('should error due to not being in the plugins.json file');

  start(['--name', 'plugin-testOne', '--name', 'plugin-testTwo', '--include-remote'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(false);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (cmd) => {
      await cmd.run();

      expect(cmd._flags.name.includes('plugin-testOne'));
      expect(cmd._flags.name.includes('plugin-testTwo'));
      expect(cmd._flags.name.length).to.equal(2);
      expect(cmd._flags['include-remote']).to.be.true;
    })
    .it('should read the name and include-remote flags');

  start(['--name', 'plugin-testOne'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(false);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (cmd) => {
      await cmd.run();

      expect(cmd._flags.name.includes('plugin-testOne'));
      expect(cmd._flags.name.length).to.equal(1);
      expect(cmd._flags['include-remote']).to.be.undefined;
    })
    .it('should process the one plugin');

  start(['--name', 'plugin-testOne@remote'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(false);
    })
    .test(async (cmd) => {
      try {
        await cmd.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('at least one local plugin');
        expect(cmd.runScript).not.to.have.been.called;
        expect(cmd.spawnScript).not.to.have.been.called;
      }
    })
    .it('should throw an error for no local plugins');

  start([''])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
      sinon.stub(cmd, 'spawnScript').returnsThis();
      sinon.stub(cmd, 'isPluginFolder').returns(false);
      sinon.stub(cmd, 'pluginsConfig').get(() => config);
    })
    .test(async (cmd) => {
      try {
        await cmd.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('not a flex plugin');
        expect(cmd._flags.name).to.be.undefined;
        expect(cmd._flags['include-remote']).to.be.undefined;
      }
    })
    .it('should throw an error if not in a plugin directory and no plugins given');

  start()
    .test(async (cmd) => {
      expect(cmd.checkCompatibility).to.equal(true);
    })
    .it('should have compatibility set');

  start(['--name', 'plugin-testOne', '--name', 'plugin-testTwo'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder');
    })
    .test(async (cmd) => {
      // @ts-ignore
      expect(cmd.isMultiPlugin()).to.equal(true);
      expect(cmd.isPluginFolder).not.to.have.been.called;
    })
    .it('should return true if multiple plugins are provided');

  start(['--include-remote'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder');
    })
    .test(async (cmd) => {
      // @ts-ignore
      expect(cmd.isMultiPlugin()).to.equal(true);
      expect(cmd.isPluginFolder).not.to.have.been.called;
    })
    .it('should return true if include-remote is set');

  start([])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(false);
    })
    .test(async (cmd) => {
      // @ts-ignore
      expect(cmd.isMultiPlugin()).to.equal(false);
      expect(cmd.isPluginFolder).not.to.have.been.called;
    })
    .it('should return false if no plugins');

  start(['--name', 'plugin-sample'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(false);
      sinon.stub(cmd, 'pkg').get(() => ({
        name: 'plugin-sample',
      }));
    })
    .test(async (cmd) => {
      // @ts-ignore
      expect(cmd.isMultiPlugin()).to.equal(false);
      expect(cmd.isPluginFolder).to.have.been.calledOnce;
    })
    .it('should return false if plugin directory is set but is the same as the --name');

  start(['--name', 'plugin-sample'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'pkg').get(() => ({
        name: 'plugin-another',
      }));
    })
    .test(async (cmd) => {
      // @ts-ignore
      expect(cmd.isMultiPlugin()).to.equal(true);
      expect(cmd.isPluginFolder).to.have.been.calledOnce;
    })
    .it('should return true if plugin directory is and is different');
});
