import { Logger, singleLineString, boxen, confirm, coloredStrings } from 'flex-plugins-utils-logger';

import { exit } from '../utils/general';

const cracoUpgradeGuideLink = 'https://twilio.com';

/**
 * Upgrade notification
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const upgradeNotification = (logger: Logger) => async (skip: boolean) => {
  boxen.warning('You are about to upgrade your plugin to use the latest version of Flex Plugin CLI.');
  if (!skip) {
    const answer = await confirm('Please backup your plugin either locally or on GitHub. Do you want to continue?');
    if (!answer) {
      exit(0);
    }
  }
};

/**
 * Upgrade to latest
 */
const upgradeToLatest = (logger: Logger) => () => {
  logger.info(`@@Updating your plugin\'s dependencies to the latest version@@`);
  logger.newline();
};

/**
 * Script started
 */
const scriptStarted = (logger: Logger) => (version: string) => {
  logger.info(`@@**Upgrading your plugin from ${version} to v4**@@`);
  logger.newline();
};

/**
 * Script succeeded
 */
const scriptSucceeded = (logger: Logger) => (needsInstall: boolean) => {
  logger.newline();
  logger.success('🎉 Your plugin was successfully migrated to use the latest (v4) version of Flex Plugins CLI.');
  logger.newline();

  logger.info('**Next Steps:**');
  const helpInstruction = '{{$ twilio flex:plugins --help}} to find out more about the new CLI';
  if (needsInstall) {
    logger.info(`Run {{$ npm install}} to update all the dependencies and then ${helpInstruction}.`);
  } else {
    logger.info(`Run ${helpInstruction}.`);
  }
};

/**
 * Failed to update plugin's url
 */
const updatePluginUrl = (logger: Logger) => (newline: boolean) => {
  if (newline) {
    logger.newline();
  }
  logger.info(
    singleLineString(
      '> !!Could not update {{public/appConfig.js}} because your pluginService url has been modified.',
      "Please update the pluginService url to '/plugins'.",
      'You may take a look at {{public/appConfig.example.js}} for guidance.!!',
    ),
  );
};

/**
 * Cannot remove craco because it has been modified
 */
const cannotRemoveCraco = (logger: Logger) => (newline: boolean) => {
  if (newline) {
    logger.newline();
  }

  logger.info(
    singleLineString(
      '> !!Cannot remove {{craco.config.js}} because it has been modified from its default value.',
      `Please review @@${cracoUpgradeGuideLink}@@ for more information.!!`,
    ),
  );
};

/**
 * Required package not found
 */
const packageNotFound = (logger: Logger) => (pkg: string) => {
  logger.newline(2);
  logger.error(`Could not find package **${pkg}** from npm repository; check your internet connection and try again.`);
};

/**
 * Warns about upgrade from the provided version is not available
 */
const notAvailable = (logger: Logger) => (version?: number) => {
  logger.error(`No migration is available for your current version v${version}.`);
};

/**
 * Warns that we could not remove a particular file or delete a script. Requires manual change
 */
const warnNotRemoved = (logger: Logger) => (note: string) => {
  logger.newline();
  logger.info(`> !!${note}. Please review and remove it manually.!!`);
};

/**
 * Remove legacy plugin notification
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeLegacyNotification = (logger: Logger) => async (pluginName: string, skip: boolean) => {
  const name = coloredStrings.name(pluginName);
  boxen.warning(`You are about to delete your legacy plugin ${name} bundle hosted on Twilio Assets.`);
  if (!skip) {
    const answer = await confirm(
      'Please confirm that you have already migrated this plugin to use the Plugins API. Do you want to continue?',
    );
    if (!answer) {
      exit(0);
    }
  }
};

/**
 * No legacy plugin was found
 * @param logger
 */
const noLegacyPluginFound = (logger: Logger) => (pluginName: string) => {
  const name = coloredStrings.name(pluginName);

  logger.info(`Plugin bundle ${name} was not found; it may have already been successfully migrated to Plugins API.`);
  logger.newline();

  logger.info('**Next Steps:**');
  logger.info(`Run {{$ twilio flex:plugins:describe:plugin --name ${name}}} for more information on your plugin.`);
};

/**
 * Remove legacy was successful
 * @param logger
 */
const removeLegacyPluginSucceeded = (logger: Logger) => (pluginName: string) => {
  const name = coloredStrings.name(pluginName);

  logger.newline();
  logger.success(
    `🎉 Your legacy plugin ${name} bundle was successfully removed from Twilio Assets. The migration of your plugin to Plugins API is now complete.`,
  );
  logger.newline();
};

/**
 * Warning about plugin not registed with plugins api yet
 */
const warningPluginNotInAPI = (logger: Logger) => (pluginName: string) => {
  const name = coloredStrings.name(pluginName);

  logger.info(`Plugin ${name} has not been migrated to Plugins API.`);
  logger.newline();
  logger.info(`Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-beta \\-\\-install}} to upgrade your plugin code.`);
  logger.info(
    `Run {{$ twilio flex:plugins:deploy \\-\\-changelog "migrating to Flex Plugins API" \\-\\-major}} to register with Plugins API.`,
  );
  logger.info(`Run {{$ twilio flex:plugins:upgrade-plugin --remove-legacy-plugin}} again after to finish migration.`);
};

export default (logger: Logger) => ({
  upgradeNotification: upgradeNotification(logger),
  scriptStarted: scriptStarted(logger),
  upgradeToLatest: upgradeToLatest(logger),
  scriptSucceeded: scriptSucceeded(logger),
  updatePluginUrl: updatePluginUrl(logger),
  cannotRemoveCraco: cannotRemoveCraco(logger),
  packageNotFound: packageNotFound(logger),
  notAvailable: notAvailable(logger),
  warnNotRemoved: warnNotRemoved(logger),
  removeLegacyNotification: removeLegacyNotification(logger),
  noLegacyPluginFound: noLegacyPluginFound(logger),
  removeLegacyPluginSucceeded: removeLegacyPluginSucceeded(logger),
  warningPluginNotInAPI: warningPluginNotInAPI(logger),
});
