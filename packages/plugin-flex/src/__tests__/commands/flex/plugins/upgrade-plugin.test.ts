import { expect, createTest } from '../../../framework';
import { TwilioCliError } from '../../../../exceptions';
import FlexPluginsUpgradePlugin from '../../../../commands/flex/plugins/upgrade-plugin';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsUpgradePlugin);
  afterEach(() => {
    sinon.restore();
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
});
