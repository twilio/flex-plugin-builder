/* eslint-disable camelcase */
import { expect, createTest } from '../../../framework';
import FlexPluginsDeploy from '../../../../commands/flex/plugins/deploy';
import { TwilioCliError } from '../../../../exceptions';

describe('Commands/FlexPluginsDeploy', () => {
  const { sinon, start: _start } = createTest(FlexPluginsDeploy);
  const pkg = {
    name: 'test-package',
    description: 'the package json description',
  };
  const deployResult = {
    serviceSid: 'ZS00000000000000000000000000000',
    accountSid: 'AC00000000000000000000000000000',
    environmentSid: 'ZE00000000000000000000000000000',
    domainName: 'ruby-fox-123.twil.io',
    isPublic: false,
    nextVersion: '2.0.0',
    pluginUrl: 'https://ruby-fox-123.twil.io/plugin-url',
  };
  const pluginVersionResource = {
    sid: 'FV00000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000',
    plugin_sid: 'FP00000000000000000000000000000',
    version: deployResult.nextVersion,
    plugin_url: deployResult.pluginUrl,
    private: !deployResult.isPublic,
    changelog: 'the changelog',
    date_created: '2020',
  };
  const pluginResource = {
    sid: 'FP00000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000',
    unique_name: 'plugin-name',
    description: 'plugin description',
    friendly_name: 'plugin friendly name',
    date_created: '2020',
    date_updated: '2020',
  };

  afterEach(() => {
    sinon.restore();
  });

  const start = (args?: string[]) =>
    _start(args).setup(async (instance) => {
      sinon.stub(instance, 'isPluginFolder').returns(true);
      sinon.stub(instance, 'doRun').returnsThis();
      sinon.stub(instance, 'pkg').get(() => pkg);
      await instance.run();
    });

  start(['--major'])
    .test(async (instance) => {
      expect(instance.bumpLevel).to.equal('major');
    })
    .it('should get major bump level');

  start(['--minor'])
    .test(async (instance) => {
      expect(instance.bumpLevel).to.equal('minor');
    })
    .it('should get minor bump level');

  start(['--patch'])
    .test(async (instance) => {
      expect(instance.bumpLevel).to.equal('patch');
    })
    .it('should get patch bump level');

  start()
    .test(async (instance) => {
      expect(instance.bumpLevel).to.equal('patch');
    })
    .it('should get patch bump level without any flags');

  const pluginVersionsTest = (changelog?: string) => {
    const flags = [];
    if (changelog) {
      flags.push('--changelog', changelog);
    }

    return start(flags).setup(async (instance) => {
      sinon.stub(instance.pluginVersionsClient, 'create').resolves(pluginVersionResource);
    });
  };

  pluginVersionsTest()
    .test(async (instance) => {
      const result = await instance.registerPluginVersion(deployResult);

      expect(result).to.equal(pluginVersionResource);
      expect(instance.pluginVersionsClient.create).to.have.been.calledOnce;
      expect(instance.pluginVersionsClient.create).to.have.been.calledWith(pkg.name, {
        Version: deployResult.nextVersion,
        PluginUrl: deployResult.pluginUrl,
        Private: !deployResult.isPublic,
        Changelog: '',
      });
    })
    .it('should call registerPluginVersion without any changelog');

  pluginVersionsTest('the-changelog')
    .test(async (instance) => {
      const result = await instance.registerPluginVersion(deployResult);

      expect(result).to.equal(pluginVersionResource);
      expect(instance.pluginVersionsClient.create).to.have.been.calledOnce;
      expect(instance.pluginVersionsClient.create).to.have.been.calledWith(pkg.name, {
        Version: deployResult.nextVersion,
        PluginUrl: deployResult.pluginUrl,
        Private: !deployResult.isPublic,
        Changelog: 'the-changelog',
      });
    })
    .it('should call registerPluginVersion with changelog');

  start()
    .setup(async (instance) => {
      sinon.stub(instance.pluginsClient, 'upsert').resolves(pluginResource);
    })
    .test(async (instance) => {
      const result = await instance.registerPlugin();

      expect(result).to.equal(pluginResource);
      expect(instance.pluginsClient.upsert).to.have.been.calledOnce;
      expect(instance.pluginsClient.upsert).to.have.been.calledWith({
        UniqueName: pkg.name,
        FriendlyName: pkg.name,
        Description: pkg.description,
      });
    })
    .it('should call registerPlugin');

  start()
    .setup((instance) => {
      sinon.stub(instance.pluginsClient, 'get').rejects();
      sinon.stub(instance.pluginVersionsClient, 'latest');
    })
    .test(async (instance) => {
      await instance.validatePlugin();

      expect(instance.pluginsClient.get).to.have.been.calledOnce;
      expect(instance.pluginsClient.get).to.have.been.calledWith(pkg.name);
      expect(instance.pluginVersionsClient.latest).to.not.have.been.called;

      // @ts-ignore
      const args = instance.scriptArgs;
      expect(args[0]).to.equal('version');
      expect(args[1]).to.equal('0.0.1');
      expect(args[2]).to.equal('--pilot-plugins-api');
    })
    .it('should validate brand new plugin');

  start(['--minor'])
    .setup((instance) => {
      sinon.stub(instance.pluginsClient, 'get').resolves(pluginResource);
      sinon.stub(instance.pluginVersionsClient, 'latest').resolves(pluginVersionResource);
    })
    .test(async (instance) => {
      await instance.validatePlugin();

      expect(instance.pluginsClient.get).to.have.been.calledOnce;
      expect(instance.pluginsClient.get).to.have.been.calledWith(pkg.name);
      expect(instance.pluginVersionsClient.latest).to.have.been.calledOnce;
      expect(instance.pluginVersionsClient.latest).to.have.been.calledWith(pkg.name);

      // @ts-ignore
      const args = instance.scriptArgs;
      expect(args[0]).to.equal('version');
      expect(args[1]).to.equal('2.1.0');
      expect(args[2]).to.equal('--pilot-plugins-api');
    })
    .it('should validate plugin as a minor bump');

  start(['--version', 'not-a-semver'])
    .setup((instance) => {
      sinon.stub(instance.pluginsClient, 'get').resolves(pluginResource);
      sinon.stub(instance.pluginVersionsClient, 'latest').resolves(pluginVersionResource);
    })
    .test(async (instance, _, done) => {
      try {
        await instance.validatePlugin();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('valid semver');
        expect(instance.pluginsClient.get).to.have.been.calledOnce;
        expect(instance.pluginsClient.get).to.have.been.calledWith(pkg.name);
        expect(instance.pluginVersionsClient.latest).to.have.been.calledOnce;
        expect(instance.pluginVersionsClient.latest).to.have.been.calledWith(pkg.name);

        done();
      }
    })
    .it('should invalidate plugin because version is not semver');

  start(['--version', '0.0.1'])
    .setup((instance) => {
      sinon.stub(instance.pluginsClient, 'get').resolves(pluginResource);
      sinon.stub(instance.pluginVersionsClient, 'latest').resolves(pluginVersionResource);
    })
    .test(async (instance, _, done) => {
      try {
        await instance.validatePlugin();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('version 0.0.1 must be greater than 2.0.0');
        expect(instance.pluginsClient.get).to.have.been.calledOnce;
        expect(instance.pluginsClient.get).to.have.been.calledWith(pkg.name);
        expect(instance.pluginVersionsClient.latest).to.have.been.calledOnce;
        expect(instance.pluginVersionsClient.latest).to.have.been.calledWith(pkg.name);

        done();
      }
    })
    .it('should invalidate plugin because next version is smaller');
});
