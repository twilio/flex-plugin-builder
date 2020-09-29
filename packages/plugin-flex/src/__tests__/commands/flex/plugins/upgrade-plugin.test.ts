import { TwilioApiError } from 'flex-plugins-utils-exception';

import { expect, createTest } from '../../../framework';
import { TwilioCliError } from '../../../../exceptions';
import FlexPluginsUpgradePlugin from '../../../../commands/flex/plugins/upgrade-plugin';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsUpgradePlugin);
  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsUpgradePlugin.hasOwnProperty('flags')).to.equal(true);
  });

  start()
    .setup((instance) => {
      sinon.stub(instance, 'pkg').get(() => ({
        dependencies: { 'flex-plugin-scripts': '3.0.0' },
      }));
    })
    .test((instance) => {
      expect(instance.pkgVersion).to.equal(3);
    })
    .it('should should return then version of flex-plugin-scripts from dependencies');

  start()
    .setup((instance) => {
      sinon.stub(instance, 'pkg').get(() => ({
        dependencies: {},
        devDependencies: { 'flex-plugin-scripts': '4.0.0' },
      }));
    })
    .test((instance) => {
      expect(instance.pkgVersion).to.equal(4);
    })
    .it('should should return the version of flex-plugin-scripts from devDependencies');

  start()
    .setup((instance) => {
      sinon.stub(instance, 'pkg').get(() => ({
        dependencies: {},
        devDependencies: {},
      }));
    })
    .test((instance) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x = instance.pkgVersion;
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('not found');
      }
    })
    .it('should should throw exception if no version is found');

  start()
    .setup((instance, ctx) => {
      const untouchedScripts = {
        untouchedCommand: 'some command',
        // modified
        commandModified: 'some random command2',
        // command with pre, where pre is modified by main is not; it should not be removed
        preCommandWithPreModified: 'pre some command with pre',
        commandWithPreModified: 'some command with pre',
        // command with pre, where main is modified, so it should not be removed
        preCommandModifiedWithPreModified: 'pre command',
        commandModifiedWithPreModified: 'command modified',
        // command with post, where post is modified by main is not; it should not be removed
        commandWithPostModified: 'some command with post',
        postCommandWithPostModified: 'post some command with post',
        // command with post, where main is modified, so it should not be removed
        commandModifiedWithPostModified: 'command modified',
        postCommandModifiedWithPostModified: 'post command',
      };
      ctx.variables.untouchedScripts = untouchedScripts;

      sinon.stub(instance, 'pkg').get(() => ({
        scripts: {
          ...untouchedScripts,
          untouchedCommand: 'some command',
          // unmodified, should be removed
          commandToBeRemoved: 'some random command1',
          // command that has a pre, unmodified so should be removed
          preCommandWithPre: 'pre some command with pre',
          commandWithPre: 'some command with pre',
          // command that has a post, unmodified so should be removed
          commandWithPost: 'some command with post',
          postCommandWithPost: 'post some command with post',
        },
      }));
      sinon.stub(fs, 'writeJSONFile').returnsThis();
    })
    .test(async (instance, ctx) => {
      await instance.removePackageScripts([
        { name: 'commandToBeRemoved', it: 'some random command1' },
        { name: 'commandModified', it: 'original command' },
        { name: 'commandModified', it: 'original command' },
        { name: 'commandWithPre', it: 'some command with pre', pre: 'pre some command with pre' },
        { name: 'commandWithPreModified', it: 'some command with pre', pre: 'original command' },
        { name: 'commandModifiedWithPreModified', it: 'original command', pre: 'pre command' },
        { name: 'commandWithPost', it: 'some command with post', post: 'post some command with post' },
        { name: 'commandWithPostModified', it: 'some command with post', post: 'original command' },
        { name: 'commandModifiedWithPostModified', it: 'original command', post: 'post command' },
      ]);
      expect(fs.writeJSONFile).to.have.been.calledOnce;
      // @ts-ignore
      const { match } = sinon;
      expect(fs.writeJSONFile).to.have.been.calledWith(
        match({ scripts: ctx.variables.untouchedScripts }),
        match.string,
        match.string,
      );
    })
    .it('should remove packages that have no post/post');

  start()
    .setup((instance) => {
      // @ts-ignore
      const sha = FlexPluginsUpgradePlugin.cracoConfigSha;
      // @ts-ignore
      sinon.stub(instance, 'cwd').get(() => 'cwd');
      // @ts-ignore
      sinon.stub(instance.prints, 'cannotRemoveCraco').returnsThis();
      sinon.stub(fs, 'fileExists').withArgs('cwd', 'craco.config.js').returns(true);
      sinon.stub(fs, 'calculateSha256').returns(Promise.resolve(sha));
      sinon.stub(fs, 'copyFile').returnsThis();
      sinon.stub(fs, 'removeFile').returnsThis();
    })
    .test(async (instance) => {
      await instance.cleanupScaffold();

      expect(fs.calculateSha256).to.have.been.calledOnce;
      expect(fs.removeFile).to.have.been.calledOnce;
      // @ts-ignore
      expect(instance.prints.cannotRemoveCraco).not.to.have.been.called;
    })
    .it('should remove craco.config.js');

  start()
    .setup((instance) => {
      // @ts-ignore
      sinon.stub(instance, 'cwd').get(() => 'cwd');
      // @ts-ignore
      sinon.stub(instance.prints, 'cannotRemoveCraco').returnsThis();
      sinon.stub(fs, 'fileExists').withArgs('cwd', 'craco.config.js').returns(true);
      sinon.stub(fs, 'calculateSha256').returns(Promise.resolve('abc123'));
      sinon.stub(fs, 'copyFile').returnsThis();
      sinon.stub(fs, 'removeFile').returnsThis();
    })
    .test(async (instance) => {
      await instance.cleanupScaffold();

      expect(fs.calculateSha256).to.have.been.calledOnce;
      expect(fs.removeFile).not.to.have.been.called;
      // @ts-ignore
      expect(instance.prints.cannotRemoveCraco).to.have.been.calledOnce;
    })
    .it('should not remove craco.config.js if modified');

  start()
    .setup((instance) => {
      // @ts-ignore
      sinon.stub(instance, 'cwd').get(() => 'cwd');
      // @ts-ignore
      sinon.stub(instance.prints, 'updatePluginUrl').returnsThis();
      sinon.stub(fs, 'fileExists').withArgs('cwd', 'public', 'appConfig.js').returns(true);
      sinon.stub(fs, 'calculateSha256').returns(Promise.resolve('abc123'));
      sinon.stub(fs, 'copyFile').returnsThis();
      sinon.stub(fs, 'writeFile').returnsThis();
      sinon.stub(fs, 'readFile').returns('line1\nurl: pluginServiceUrl\nline2');
    })
    .test(async (instance) => {
      await instance.cleanupScaffold();

      expect(fs.writeFile).to.have.been.calledOnce;
      expect(fs.writeFile).to.have.been.calledWith("line1\nurl: '/plugins'\nline2", 'cwd', 'public', 'appConfig.js');

      // @ts-ignore
      expect(instance.prints.updatePluginUrl).not.to.have.been.called;
    })
    .it('should cleanup appConfig.js');

  start()
    .setup((instance, ctx) => {
      ctx.variables.appConfig = 'line1\nurl: something else\nline2';

      // @ts-ignore
      sinon.stub(instance, 'cwd').get(() => 'cwd');
      // @ts-ignore
      sinon.stub(instance.prints, 'updatePluginUrl').returnsThis();
      sinon.stub(fs, 'fileExists').withArgs('cwd', 'public', 'appConfig.js').returns(true);
      sinon.stub(fs, 'calculateSha256').returns(Promise.resolve('abc123'));
      sinon.stub(fs, 'copyFile').returnsThis();
      sinon.stub(fs, 'writeFile').returnsThis();
      sinon.stub(fs, 'readFile').returns(ctx.variables.appConfig as string);
    })
    .test(async (instance, ctx) => {
      await instance.cleanupScaffold();

      expect(fs.writeFile).to.have.been.calledOnce;
      expect(fs.writeFile).to.have.been.calledWith(ctx.variables.appConfig, 'cwd', 'public', 'appConfig.js');

      // @ts-ignore
      expect(instance.prints.updatePluginUrl).to.have.been.calledOnce;
    })
    .it('should warn about cleaning up appConfig.js');

  start(['--remove-legacy-plugin'])
    .setup((cmd) => {
      sinon.stub(cmd, 'removeLegacyPlugin').returnsThis();
    })
    .test(async (cmd) => {
      await cmd.doRun();

      expect(cmd.removeLegacyPlugin).to.have.been.calledOnce;
    })
    .it('should call removeLegacyPlugin');

  const removeLegacyPlugin = () =>
    start([]).setup(async (cmd) => {
      // @ts-ignore
      const { prints } = cmd;

      sinon.stub(cmd, 'exit').returnsThis();
      sinon.stub(prints, 'removeLegacyNotification').returns(Promise.resolve());
      sinon.stub(prints, 'warningPluginNotInAPI');
      sinon.stub(prints, 'noLegacyPluginFound');
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'doRun').returnsThis();
      await cmd.run();
    });

  removeLegacyPlugin()
    .setup(async (cmd) => {
      sinon.stub(cmd.pluginsClient, 'get').returns(Promise.reject(new TwilioApiError(0, '', 404)));
    })
    .test(async (cmd) => {
      await cmd.removeLegacyPlugin();

      // @ts-ignore
      expect(cmd.prints.warningPluginNotInAPI).to.have.been.calledOnce;
      expect(cmd.exit).to.have.been.calledOnce;
      expect(cmd.exit).to.have.been.calledWith(1);
    })
    .it('should print warning about plugins-api registration required before remove-legacy');

  removeLegacyPlugin()
    .setup(async (cmd) => {
      // @ts-ignore
      sinon.stub(cmd.pluginsClient, 'get').returns(Promise.resolve());
      sinon.stub(cmd.flexConfigurationClient, 'getServerlessSid').returns(Promise.resolve(null));
      sinon.stub(cmd.serverlessClient, 'hasLegacy');
    })
    .test(async (cmd) => {
      await cmd.removeLegacyPlugin();

      // @ts-ignore
      expect(cmd.prints.warningPluginNotInAPI).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).not.to.have.been.called;
    })
    .it('should exit if no serviceSid is found');

  removeLegacyPlugin()
    .setup(async (cmd) => {
      // @ts-ignore
      sinon.stub(cmd.pluginsClient, 'get').returns(Promise.resolve());
      sinon.stub(cmd.flexConfigurationClient, 'getServerlessSid').returns(Promise.resolve('ZSxxx'));
      sinon.stub(cmd.serverlessClient, 'hasLegacy').returns(Promise.resolve(false));
    })
    .test(async (cmd) => {
      await cmd.removeLegacyPlugin();

      // @ts-ignore
      expect(cmd.prints.warningPluginNotInAPI).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledWith('ZSxxx');
      // @ts-ignore
      expect(cmd.prints.noLegacyPluginFound).to.have.been.called;
    })
    .it('should notify no legacy plugin is found');

  removeLegacyPlugin()
    .setup(async (cmd) => {
      // @ts-ignore
      sinon.stub(cmd.pluginsClient, 'get').returns(Promise.resolve());
      sinon.stub(cmd.flexConfigurationClient, 'getServerlessSid').returns(Promise.resolve('ZSxxx'));
      sinon.stub(cmd.serverlessClient, 'hasLegacy').returns(Promise.resolve(true));
      sinon.stub(cmd.serverlessClient, 'removeLegacy').returns(Promise.resolve());
    })
    .test(async (cmd) => {
      await cmd.removeLegacyPlugin();

      // @ts-ignore
      expect(cmd.prints.warningPluginNotInAPI).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledWith('ZSxxx');
      expect(cmd.serverlessClient.removeLegacy).to.have.been.calledOnce;
    })
    .it('should remove legacy');
});
