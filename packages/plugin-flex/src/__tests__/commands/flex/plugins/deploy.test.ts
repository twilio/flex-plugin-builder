/* eslint-disable camelcase */
import { CLIParseError } from '@oclif/parser/lib/errors';

import { expect, createTest } from '../../../framework';
import FlexPluginsDeploy, { parseVersionInput } from '../../../../commands/flex/plugins/deploy';
import { TwilioCliError } from '../../../../exceptions';
import ServerlessClient from '../../../../clients/ServerlessClient';

describe('Commands/FlexPluginsDeploy', () => {
  const { sinon, start: _start } = createTest(FlexPluginsDeploy);
  const defaultChangelog = 'sample changlog';
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

  const getServerlessSid = sinon.mock().atLeast(1);
  const hasLegacy = sinon.mock().atLeast(1);

  afterEach(() => {
    sinon.restore();
  });

  const start = (args?: string[]) => {
    args = args ? args : [];

    return _start(['--changelog', defaultChangelog, ...args]).setup(async (cmd) => {
      getServerlessSid.resetHistory();
      hasLegacy.resetHistory();
      getServerlessSid.returns(Promise.resolve(null));
      hasLegacy.returns(Promise.resolve(false));

      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'isPluginFolder').returns(true);
      sinon.stub(cmd, 'doRun').returnsThis();
      sinon.stub(cmd, 'pkg').get(() => pkg);
      sinon.stub(cmd, 'flexConfigurationClient').get(() => ({
        getServerlessSid,
      }));
      sinon.stub(cmd, 'serverlessClient').get(() => ({
        hasLegacy,
      }));
      await cmd.run();
    });
  };

  describe('parseVersionInput', () => {
    it('should parse semver', () => {
      ['1.0.0', '1.0.0-rc.1'].forEach((s) => expect(parseVersionInput(s)).to.equal(s));
    });

    it('should throw error if invalid semver', (done) => {
      try {
        parseVersionInput('not-a-semver');
      } catch (e) {
        expect(e instanceof CLIParseError).to.equal(true);
        expect(e.message).to.contain('valid SemVer');
        done();
      }
    });

    it('should throw error version 0.0.0 is used', (done) => {
      try {
        parseVersionInput('0.0.0');
      } catch (e) {
        expect(e instanceof CLIParseError).to.equal(true);
        expect(e.message).to.contain('cannot be');
        done();
      }
    });
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDeploy.hasOwnProperty('flags')).to.equal(true);
  });

  start(['--major'])
    .test(async (cmd) => {
      expect(cmd.bumpLevel).to.equal('major');
    })
    .it('should get major bump level');

  start(['--minor'])
    .test(async (cmd) => {
      expect(cmd.bumpLevel).to.equal('minor');
    })
    .it('should get minor bump level');

  start(['--patch'])
    .test(async (cmd) => {
      expect(cmd.bumpLevel).to.equal('patch');
    })
    .it('should get patch bump level');

  start()
    .test(async (cmd) => {
      expect(cmd.bumpLevel).to.equal('patch');
    })
    .it('should get patch bump level without any flags');

  const pluginVersionsTest = (changelog?: string) => {
    const flags = [];
    if (changelog) {
      flags.push('--changelog', changelog);
    }

    return start(flags).setup(async (cmd) => {
      sinon.stub(cmd.pluginVersionsClient, 'create').resolves(pluginVersionResource);
    });
  };

  pluginVersionsTest()
    .test(async (cmd) => {
      const result = await cmd.registerPluginVersion(deployResult);

      expect(result).to.equal(pluginVersionResource);
      expect(cmd.pluginVersionsClient.create).to.have.been.calledOnce;
      expect(cmd.pluginVersionsClient.create).to.have.been.calledWith(pkg.name, {
        Version: deployResult.nextVersion,
        PluginUrl: deployResult.pluginUrl,
        Private: !deployResult.isPublic,
        Changelog: defaultChangelog,
      });
    })
    .it('should call registerPluginVersion without any changelog');

  pluginVersionsTest('the-changelog')
    .test(async (cmd) => {
      const result = await cmd.registerPluginVersion(deployResult);

      expect(result).to.equal(pluginVersionResource);
      expect(cmd.pluginVersionsClient.create).to.have.been.calledOnce;
      expect(cmd.pluginVersionsClient.create).to.have.been.calledWith(pkg.name, {
        Version: deployResult.nextVersion,
        PluginUrl: deployResult.pluginUrl,
        Private: !deployResult.isPublic,
        Changelog: 'the-changelog',
      });
    })
    .it('should call registerPluginVersion with changelog');

  start()
    .setup(async (cmd) => {
      sinon.stub(cmd.pluginsClient, 'upsert').resolves(pluginResource);
    })
    .test(async (cmd) => {
      const result = await cmd.registerPlugin();

      expect(result).to.equal(pluginResource);
      expect(cmd.pluginsClient.upsert).to.have.been.calledOnce;
      expect(cmd.pluginsClient.upsert).to.have.been.calledWith({
        UniqueName: pkg.name,
        FriendlyName: pkg.name,
        Description: '',
      });
    })
    .it('should call registerPlugin');

  start(['--description', 'some description'])
    .setup(async (cmd) => {
      sinon.stub(cmd.pluginsClient, 'upsert').resolves(pluginResource);
    })
    .test(async (cmd) => {
      const result = await cmd.registerPlugin();

      expect(result).to.equal(pluginResource);
      expect(cmd.pluginsClient.upsert).to.have.been.calledOnce;
      expect(cmd.pluginsClient.upsert).to.have.been.calledWith({
        UniqueName: pkg.name,
        FriendlyName: pkg.name,
        Description: 'some description',
      });
    })
    .it('should call registerPlugin with custom description');

  start()
    .setup((cmd) => {
      sinon.stub(cmd.pluginsClient, 'get').rejects();
      sinon.stub(cmd.pluginVersionsClient, 'latest');
    })
    .test(async (cmd) => {
      await cmd.validatePlugin();

      expect(cmd.pluginsClient.get).to.have.been.calledOnce;
      expect(cmd.pluginsClient.get).to.have.been.calledWith(pkg.name);
      expect(cmd.pluginVersionsClient.latest).to.not.have.been.called;

      // @ts-ignore
      const args = cmd.scriptArgs;
      expect(args[0]).to.equal('version');
      expect(args[1]).to.equal('0.0.1');
      expect(args[2]).to.equal('--pilot-plugins-api');
    })
    .it('should validate brand new plugin');

  start(['--minor'])
    .setup((cmd) => {
      sinon.stub(cmd.pluginsClient, 'get').resolves(pluginResource);
      sinon.stub(cmd.pluginVersionsClient, 'latest').resolves(pluginVersionResource);
    })
    .test(async (cmd) => {
      await cmd.validatePlugin();

      expect(cmd.pluginsClient.get).to.have.been.calledOnce;
      expect(cmd.pluginsClient.get).to.have.been.calledWith(pkg.name);
      expect(cmd.pluginVersionsClient.latest).to.have.been.calledOnce;
      expect(cmd.pluginVersionsClient.latest).to.have.been.calledWith(pkg.name);

      // @ts-ignore
      const args = cmd.scriptArgs;
      expect(args[0]).to.equal('version');
      expect(args[1]).to.equal('2.1.0');
      expect(args[2]).to.equal('--pilot-plugins-api');
    })
    .it('should validate plugin as a minor bump');

  start(['--version', '0.0.1'])
    .setup((cmd) => {
      sinon.stub(cmd.pluginsClient, 'get').resolves(pluginResource);
      sinon.stub(cmd.pluginVersionsClient, 'latest').resolves(pluginVersionResource);
    })
    .test(async (cmd, _, done) => {
      try {
        await cmd.validatePlugin();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('version 0.0.1 must be greater than 2.0.0');
        expect(cmd.pluginsClient.get).to.have.been.calledOnce;
        expect(cmd.pluginsClient.get).to.have.been.calledWith(pkg.name);
        expect(cmd.pluginVersionsClient.latest).to.have.been.calledOnce;
        expect(cmd.pluginVersionsClient.latest).to.have.been.calledWith(pkg.name);

        done();
      }
    })
    .it('should invalidate plugin because next version is smaller');

  start()
    .setup(() => {
      getServerlessSid.returns(Promise.resolve(null));
    })
    .test(async (cmd) => {
      await cmd.checkForLegacy();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).not.to.have.been.called;
    })
    .it('should do nothing if no serviceSid is found');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve('ZSxxx'));
      hasLegacy.returns(Promise.resolve(false));
      // @ts-ignore
      sinon.stub(cmd.prints, 'warnHasLegacy');
    })
    .test(async (cmd) => {
      await cmd.checkForLegacy();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledWith('ZSxxx', pkg.name);
      // @ts-ignore
      expect(cmd.prints.warnHasLegacy).not.to.have.been.called;
    })
    .it('should print nothing if no legacy plugin is found');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve('ZSxxx'));
      hasLegacy.returns(Promise.resolve(true));
      // @ts-ignore
      sinon.stub(cmd.prints, 'warnHasLegacy');
    })
    .test(async (cmd) => {
      await cmd.checkForLegacy();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledOnce;
      expect(cmd.serverlessClient.hasLegacy).to.have.been.calledWith('ZSxxx', pkg.name);
      // @ts-ignore
      expect(cmd.prints.warnHasLegacy).to.have.been.calledOnce;
    })
    .it('should print warning if legacy plugin found');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve('ZS123'));

      const getService = sinon.mock().atLeast(1);
      const getOrCreateDefaultService = sinon.mock().atLeast(1);
      const updateServiceName = sinon.mock().atLeast(1);
      const unregisterServerlessSid = sinon.mock().atLeast(1);
      const registerServerlessSid = sinon.mock().atLeast(1);
      getService.returns(
        Promise.resolve({
          friendlyName: ServerlessClient.NewService.friendlyName,
        }),
      );

      sinon.stub(cmd, 'serverlessClient').get(() => ({
        getService,
        updateServiceName,
        getOrCreateDefaultService,
      }));
      sinon.stub(cmd, 'flexConfigurationClient').get(() => ({
        getServerlessSid,
        unregisterServerlessSid,
        registerServerlessSid,
      }));
    })
    .test(async (cmd) => {
      await cmd.checkServerlessInstance();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.getService).to.have.been.calledOnce;
      expect(cmd.serverlessClient.updateServiceName).not.to.have.been.called;
      expect(cmd.serverlessClient.getOrCreateDefaultService).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.registerServerlessSid).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.to.have.been.called;
    })
    .it('should do nothing if service already exists and has correct name');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve('ZS123'));

      const getService = sinon.mock().atLeast(1);
      const getOrCreateDefaultService = sinon.mock().atLeast(1);
      const updateServiceName = sinon.mock().atLeast(1);
      const unregisterServerlessSid = sinon.mock().atLeast(1);
      const registerServerlessSid = sinon.mock().atLeast(1);

      getService.returns(
        Promise.resolve({
          friendlyName: 'something else',
        }),
      );

      sinon.stub(cmd, 'serverlessClient').get(() => ({
        getService,
        updateServiceName,
        getOrCreateDefaultService,
      }));
      sinon.stub(cmd, 'flexConfigurationClient').get(() => ({
        getServerlessSid,
        unregisterServerlessSid,
        registerServerlessSid,
      }));
    })
    .test(async (cmd) => {
      await cmd.checkServerlessInstance();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.getService).to.have.been.calledOnce;
      expect(cmd.serverlessClient.updateServiceName).to.have.been.calledOnce;
      expect(cmd.serverlessClient.getOrCreateDefaultService).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.registerServerlessSid).not.to.have.been.called;
      expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.to.have.been.called;
    })
    .it('should do update service name');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve(null));
      const getService = sinon.mock().atLeast(1);
      const getOrCreateDefaultService = sinon.mock().atLeast(1);
      const updateServiceName = sinon.mock().atLeast(1);
      const unregisterServerlessSid = sinon.mock().atLeast(1);
      const registerServerlessSid = sinon.mock().atLeast(1);
      getOrCreateDefaultService.returns(Promise.resolve({ sid: 'ZS456' }));

      sinon.stub(cmd, 'serverlessClient').get(() => ({
        getService,
        updateServiceName,
        getOrCreateDefaultService,
      }));
      sinon.stub(cmd, 'flexConfigurationClient').get(() => ({
        getServerlessSid,
        unregisterServerlessSid,
        registerServerlessSid,
      }));
    })
    .test(async (cmd) => {
      await cmd.checkServerlessInstance();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.getService).not.to.have.been.called;
      expect(cmd.serverlessClient.updateServiceName).not.to.have.been.called;
      expect(cmd.serverlessClient.getOrCreateDefaultService).to.have.been.calledOnce;
      expect(cmd.flexConfigurationClient.registerServerlessSid).to.have.been.calledOnce;
      expect(cmd.flexConfigurationClient.registerServerlessSid).to.have.been.calledWith('ZS456');
      expect(cmd.flexConfigurationClient.unregisterServerlessSid).not.to.have.been.called;
    })
    .it('should create new service');

  start()
    .setup((cmd) => {
      getServerlessSid.returns(Promise.resolve('ZS123'));
      const getService = sinon.mock().atLeast(1);
      const getOrCreateDefaultService = sinon.mock().atLeast(1);
      const updateServiceName = sinon.mock().atLeast(1);
      const unregisterServerlessSid = sinon.mock().atLeast(1);
      const registerServerlessSid = sinon.mock().atLeast(1);
      getOrCreateDefaultService.returns(Promise.resolve({ sid: 'ZS456' }));
      getService.rejects(new TwilioCliError());

      sinon.stub(cmd, 'serverlessClient').get(() => ({
        getService,
        updateServiceName,
        getOrCreateDefaultService,
      }));
      sinon.stub(cmd, 'flexConfigurationClient').get(() => ({
        getServerlessSid,
        unregisterServerlessSid,
        registerServerlessSid,
      }));
    })
    .test(async (cmd) => {
      await cmd.checkServerlessInstance();

      expect(cmd.flexConfigurationClient.getServerlessSid).to.have.been.calledOnce;
      expect(cmd.serverlessClient.getService).to.have.been.calledOnce;
      expect(cmd.serverlessClient.updateServiceName).not.to.have.been.called;
      expect(cmd.serverlessClient.getOrCreateDefaultService).to.have.been.calledOnce;
      expect(cmd.flexConfigurationClient.registerServerlessSid).to.have.been.calledOnce;
      expect(cmd.flexConfigurationClient.registerServerlessSid).to.have.been.calledWith('ZS456');
      expect(cmd.flexConfigurationClient.unregisterServerlessSid).to.have.been.calledOnce;
      expect(cmd.flexConfigurationClient.unregisterServerlessSid).to.have.been.calledWith('ZS123');
    })
    .it('should re-create new service');

  start()
    .test(async (cmd) => {
      expect(cmd.checkCompatibility).to.equal(true);
    })
    .it('should have compatibility set');
});
