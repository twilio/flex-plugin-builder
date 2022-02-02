import { PluginVersionResource } from '@twilio/flex-plugins-api-client/dist/clients/pluginVersions';
import { DeployResult, _verifyPath, _verifyFlexUIConfiguration } from '@twilio/flex-plugin-scripts/dist/scripts/deploy';
import getRuntime from '@twilio/flex-plugin-scripts/dist/utils/runtime';
import { CLIParseError } from '@oclif/parser/lib/errors';
import {
  FlexPluginError,
  TwilioCliError,
  progress,
  getCredential,
  env,
  semver,
  ReleaseType,
  confirm,
} from '@twilio/flex-dev-utils';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';
import { PluginResource } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../utils/flags';
import { createDescription, instanceOf } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import ServerlessClient from '../../../clients/ServerlessClient';

interface ValidatePlugin {
  currentVersion: string;
  nextVersion: string;
}

/**
 * Parses the version input
 * @param input
 */
export const parseVersionInput = (input: string): string => {
  if (!semver.valid(input)) {
    const message = `Flag --version=${input} must be a valid SemVer`;
    throw new CLIParseError({ parse: {}, message });
  }
  if (input === '0.0.0') {
    const message = `Flag --version=${input} cannot be 0.0.0`;
    throw new CLIParseError({ parse: {}, message });
  }

  return input;
};

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Builds and then deploys the Flex Plugin
 */
export default class FlexPluginsDeploy extends FlexPlugin {
  static topicName = 'flex:plugins:deploy';

  static description = createDescription(FlexPluginsDeploy.topic.description, true);

  static flags = {
    ...baseFlags,
    patch: flags.boolean({
      description: FlexPluginsDeploy.topic.flags.patch,
      exclusive: ['minor', 'major', 'version'],
    }),
    minor: flags.boolean({
      description: FlexPluginsDeploy.topic.flags.minor,
      exclusive: ['patch', 'major', 'version'],
    }),
    major: flags.boolean({
      description: FlexPluginsDeploy.topic.flags.major,
      exclusive: ['patch', 'minor', 'version'],
    }),
    version: flags.string({
      description: FlexPluginsDeploy.topic.flags.version,
      exclusive: ['patch', 'minor', 'major'],
      parse: parseVersionInput,
    }),
    public: flags.boolean({
      description: FlexPluginsDeploy.topic.flags.public,
      default: false,
    }),
    changelog: flags.string({
      description: FlexPluginsDeploy.topic.flags.changelog,
      required: true,
      max: 1000,
    }),
    description: flags.string({
      description: FlexPluginsDeploy.topic.flags.description,
      max: 500,
    }),
  };

  // @ts-ignore
  private prints;

  private nextVersion?: string = undefined;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, {});

    this.scriptArgs = [];
    this.prints = this._prints.deploy;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    await this.checkServerlessInstance();
    await this.checkForLegacy();

    const args = ['--quiet', '--persist-terminal'];

    const name = `**${this.pkg.name}**`;

    await progress(`Validating deployment of plugin ${name}`, async () => this.validatePlugin(), false);
    await progress(
      `Compiling a production build of ${name}`,
      async () => {
        await this.runScript('pre-script-check', args);
        const buildArgs = [...args];
        if (this.nextVersion) {
          buildArgs.push('--version', this.nextVersion);
        }
        return this.runScript('build', [...buildArgs]);
      },
      false,
    );

    const hasCollisionAndOverwrite = await this.hasCollisionAndOverwrite();
    if (hasCollisionAndOverwrite) {
      args.push('--overwrite');
    }

    await _verifyFlexUIConfiguration();
    const deployedData: DeployResult = await progress(
      `Uploading ${name}`,
      async () => this.runScript('deploy', [...this.scriptArgs, ...args]),
      false,
    );
    await progress(`Registering plugin ${name} with Plugins API`, async () => this.registerPlugin(), false);
    const pluginVersion: PluginVersionResource = await progress(
      `Registering version **v${deployedData.nextVersion}** with Plugins API`,
      async () => this.registerPluginVersion(deployedData),
      false,
    );

    /* istanbul ignore next */
    this.prints.deploySuccessful(
      this.pkg.name,
      pluginVersion.private ? 'private' : 'public',
      deployedData,
      this.argv.includes('--profile') ? this.currentProfile.id : null,
    );
  }

  /**
   * Checks if there is already an uploaded asset with the same version and prompts user with an option to override if so
   * @returns {Promise<boolean>}
   */
  async hasCollisionAndOverwrite(): Promise<boolean> {
    if (env.isCI()) {
      return false;
    }

    const credentials = await getCredential();
    const runtime = await getRuntime(credentials);
    if (!runtime.environment) {
      throw new FlexPluginError('No Runtime environment was found');
    }

    const pluginBaseUrl = getPaths().assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', this.nextVersion as string);
    const collision = runtime.build ? !_verifyPath(pluginBaseUrl, runtime.build) : false;

    if (!collision) {
      return false;
    }

    return confirm(
      'Plugin package has already been uploaded previously for this version of the plugin. Would you like to overwrite it?',
      'N',
    );
  }

  /**
   * Validates that the provided next plugin version is valid
   * @returns {Promise<void>}
   */
  async validatePlugin(): Promise<ValidatePlugin> {
    let currentVersion = '0.0.0';

    try {
      // Plugin may not exist yet
      await this.pluginsClient.get(this.pkg.name);
      const pluginVersion = await this.pluginVersionsClient.latest(this.pkg.name);
      currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
    } catch (e) {
      // No-op - no plugin exists yet; we'll create it later.
    }

    const nextVersion = this._flags.version || (semver.inc(currentVersion, this.bumpLevel) as string);
    if (!semver.valid(nextVersion)) {
      throw new TwilioCliError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
    }

    // Set the plugin version
    this.nextVersion = nextVersion;
    this.scriptArgs.push('version', nextVersion);
    if (this._flags.public) {
      this.scriptArgs.push('--public');
    }

    return {
      currentVersion,
      nextVersion,
    };
  }

  /**
   * Registers a plugin with Plugins API
   * @returns {Promise}
   */
  async registerPlugin(): Promise<PluginResource> {
    return this.pluginsClient.upsert({
      UniqueName: this.pkg.name,
      FriendlyName: this.pkg.name,
      Description: this._flags.description || '',
    });
  }

  /**
   * Registers a Plugin Version
   * @param deployResult
   * @returns {Promise}
   */
  async registerPluginVersion(deployResult: DeployResult): Promise<PluginVersionResource> {
    return this.pluginVersionsClient.create(this.pkg.name, {
      Version: deployResult.nextVersion,
      PluginUrl: deployResult.pluginUrl,
      Private: !deployResult.isPublic,
      Changelog: this._flags.changelog || '',
    });
  }

  /**
   * Checks whether a Serverless instance exists or not. If not, will create one
   */
  async checkServerlessInstance(): Promise<void> {
    const serviceSid = await this.flexConfigurationClient.getServerlessSid();
    if (serviceSid) {
      try {
        const service = await this.serverlessClient.getService(serviceSid);
        if (service.friendlyName !== ServerlessClient.NewService.friendlyName) {
          await this.serverlessClient.updateServiceName(serviceSid);
        }

        return;
      } catch (e) {
        if (!instanceOf(e, TwilioCliError)) {
          throw e;
        }
        await this.flexConfigurationClient.unregisterServerlessSid(serviceSid);
      }
    }
    const service = await this.serverlessClient.getOrCreateDefaultService();
    await this.flexConfigurationClient.registerServerlessSid(service.sid);
  }

  /**
   * Checks to see if a legacy plugin exist
   */
  async checkForLegacy(): Promise<void> {
    const serviceSid = await this.flexConfigurationClient.getServerlessSid();
    if (serviceSid) {
      const hasLegacy = await this.serverlessClient.hasLegacy(serviceSid, this.pkg.name);
      if (hasLegacy) {
        this.prints.warnHasLegacy();
      }
    }
  }

  /**
   * Finds the version bump level
   * @returns {string}
   */
  get bumpLevel(): ReleaseType {
    if (this._flags.major) {
      return 'major';
    }

    if (this._flags.minor) {
      return 'minor';
    }

    return 'patch';
  }

  /**
   * Parses the flags passed to this command
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsDeploy.flags> {
    return this.parse(FlexPluginsDeploy).flags;
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
