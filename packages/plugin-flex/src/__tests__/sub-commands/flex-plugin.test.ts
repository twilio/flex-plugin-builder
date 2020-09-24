import { expect, createTest } from '../framework';
import FlexPlugin from '../../sub-commands/flex-plugin';
import * as fs from '../../utils/fs';
import { TwilioCliError } from '../../exceptions';

describe('SubCommands/FlexPlugin', () => {
  const { env } = process;
  const { sinon, start } = createTest(FlexPlugin);

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup(() => {
      sinon.stub(fs, 'filesExist').returns(false);
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(false);
      expect(fs.filesExist).to.have.been.calledOnce;
    })
    .it('should test isPluginFolder to be false if no package.json is found');

  start()
    .setup((cmd) => {
      sinon.stub(fs, 'filesExist').returns(true);
      sinon.stub(cmd, 'pkg').get(() => ({
        dependencies: {},
        devDependencies: {
          'flex-plugin-scripts': '',
        },
      }));
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(false);
      expect(fs.filesExist).to.have.been.calledOnce;
    })
    .it('should test isPluginFolder to be false if one scripts not found in package.json');

  start()
    .setup((cmd) => {
      sinon.stub(fs, 'filesExist').returns(true);
      sinon.stub(cmd, 'pkg').get(() => ({
        dependencies: {
          'flex-plugin-scripts': '',
          '@twilio/flex-ui': '',
        },
        devDependencies: {},
      }));
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(true);
      expect(fs.filesExist).to.have.been.calledOnce;
    })
    .it('should test isPluginFolder to be true if both scripts found in dependencies');

  start()
    .setup((cmd) => {
      sinon.stub(fs, 'filesExist').returns(true);
      sinon.stub(cmd, 'pkg').get(() => ({
        dependencies: {},
        devDependencies: {
          'flex-plugin-scripts': '',
          '@twilio/flex-ui': '',
        },
      }));
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(true);
      expect(fs.filesExist).to.have.been.calledOnce;
    })
    .it('should test isPluginFolder to be true if both scripts found in devDependencies');

  start()
    .setup(async () => {
      sinon.stub(fs, 'filesExist').returns(false);
    })
    .test((cmd) => {
      const result = cmd.isPluginFolder();

      expect(result).to.equal(false);
      expect(fs.filesExist).to.have.been.calledOnce;
    })
    .it('should test isPluginFolder to be false');

  start()
    .test(async (cmd, _, done) => {
      try {
        await cmd.doRun();
      } catch (e) {
        expect(e.message).to.contain(' must be implemented');
        done();
      }
    })
    .it('should tet doRun throws exception');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'doRun').resolves();

      await cmd.run();
    })
    .test(() => {
      expect(process.env.SKIP_CREDENTIALS_SAVING).to.equal('true');
      expect(process.env.TWILIO_ACCOUNT_SID).to.not.be.empty;
      expect(process.env.TWILIO_AUTH_TOKEN).to.not.be.empty;
    })
    .it('should call setEnvironment');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'setupEnvironment');
      sinon.stub(cmd, 'doRun').resolves();

      await cmd.run();
    })
    .test((cmd) => {
      expect(cmd.pluginsApiToolkit).to.be.exist;
      expect(cmd.pluginsClient).to.be.exist;
      expect(cmd.pluginVersionsClient).to.be.exist;
      expect(cmd.configurationsClient).to.be.exist;

      expect(cmd.isPluginFolder).to.have.been.calledOnce;
      expect(cmd.setupEnvironment).to.have.been.calledOnce;
      expect(cmd.doRun).to.have.been.calledOnce;
    })
    .it('should run the main command successfully');

  start(['--json'])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'setupEnvironment');
      sinon.stub(cmd, 'doRun').resolves({ object: 'result' });

      await cmd.run();
    })
    .test((cmd) => {
      // @ts-ignore
      expect(cmd._logger.info).to.have.been.calledWith('{"object":"result"}');
    })
    .it('should return raw format');

  start([])
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'setupEnvironment');
      sinon.stub(cmd, 'doRun').resolves({ object: 'result' });

      await cmd.run();
    })
    .test((cmd) => {
      // @ts-ignore
      expect(cmd._logger.info).not.to.have.been.calledWith('{"object":"result"}');
    })
    .it('should not return raw format');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd, 'isPluginFolder').returns(false);
      sinon.stub(cmd, 'doRun').resolves();
    })
    .test(async (cmd, _, done) => {
      try {
        await cmd.run();
      } catch (e) {
        expect(e instanceof TwilioCliError).to.equal(true);
        expect(e.message).to.contain('flex plugin directory');
        done();
      }
    })
    .it('should throw exception if script needs to run in plugin directory but is not');
});
