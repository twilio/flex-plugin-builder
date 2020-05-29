const { flags } = require('@oclif/command');
const semver = require('semver');

const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');
const { createDescription } = require('../../../utils/general');
const { TwilioError } = require('../../../exceptions');

/**
 * Builds and then deploys the Flex plugin
 */
class FlexPluginsDeploy extends FlexPluginScripts {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.exit = process.exit;
    process.exit = (exitCode) => {
      if (exitCode === 0) {
        return;
      }

      this.exit(exitCode);
    };

    this.scriptArgs = [];
  }

  async doRun() {
    // Register plugin
    await this.registerPlugin();

    // await this.runScript('build', []);
    const deployedData = await this.runScript('deploy');

    // Register version
    const pluginVersion = await this.registerPluginVersion(deployedData);

    this.logger.info(`Successfully registered a new plugin version ${pluginVersion.version} (${pluginVersion.sid}).`);
  }

  async registerPlugin() {
    // Upsert plugin and get current latest version
    this.logger.info('Registering plugin with Plugins API...');
    const plugin = await this.pluginsClient.upsert({
      UniqueName: this.pkg.name,
      FriendlyName: this.pkg.name,
      Description: this.pkg.description || '',
    });

    const pluginVersion = await this.pluginVersionsClient.latest(plugin.sid);
    const currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
    const nextVersion = this.flags.version || semver.inc(currentVersion, this.bumpLevel);
    if (!semver.valid(nextVersion)) {
      throw new TwilioError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioError(`The provided versiocn ${nextVersion} must be greater than ${currentVersion}`);
    }

    // Set the plugin version
    this.scriptArgs.push('version', semver.inc(currentVersion, this.bumpLevel));
    this.scriptArgs.push('--pilot-plugins-api');
  }

  async registerPluginVersion(deployedData) {
    return this.pluginVersionsClient.create(this.pkg.name, {
      Version: deployedData.nextVersion,
      PluginUrl: deployedData.pluginUrl,
      Private: !this.argv.includes('--public'),
    });
  }

  get bumpLevel() {
    if (this.flags.major) {
      return 'major';
    }

    if (this.flags.minor) {
      return 'minor';
    }

    return 'patch';
  }
}

FlexPluginsDeploy.description = createDescription('Builds and deploys your Flex plugin to Twilio Assets', true);
FlexPluginsDeploy.flags = {
  patch: flags.boolean({
    exclusive: ['minor', 'major', 'version'],
  }),
  minor: flags.boolean({
    exclusive: ['patch', 'major', 'version'],
  }),
  major: flags.boolean({
    exclusive: ['patch', 'minor', 'version'],
  }),
  version: flags.string({
    exclusive: ['patch', 'minor', 'major'],
  }),
};

module.exports = FlexPluginsDeploy;
