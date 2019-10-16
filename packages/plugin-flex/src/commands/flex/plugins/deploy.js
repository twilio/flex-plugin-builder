const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Builds and then deploys the Flex plugin
 */
class FlexPluginsDeploy extends FlexPluginScripts {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.exit = process.exit;
    process.exit = exitCode => {
      if (exitCode === 0) {
        return;
      }

      this.exit(exitCode);
    };
  }

  async run() {
    await super.run();

    process.env.SKIP_CREDENTIALS_SAVING = 'true';
    process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
    process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;

    await this.runScript('build');
    await this.runScript('deploy');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsDeploy.description = 'Builds and deploys your Flex plugin to Twilio Assets';

module.exports = FlexPluginsDeploy;
