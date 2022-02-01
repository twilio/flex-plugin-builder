import { FlexConfigurationPlugin, readPluginsJson } from '@twilio/flex-dev-utils/dist/fs';
import { FlexPluginError, semver } from '@twilio/flex-dev-utils';
import { PLUGIN_INPUT_PARSER_REGEX } from 'flex-plugin-webpack';

export interface UserInputPlugin {
  name: string;
  remote: boolean;
  version?: string;
}

/**
 * Reads user input to returns the --name plugins
 * --name plugin-test will run plugin-test locally
 * --name p
 * lugin-test@remote will run plugin-test remotely
 * --include-remote will include all remote plugins
 * @param failIfNotFound
 * @param args
 */
export const parseUserInputPlugins = (failIfNotFound: boolean, ...args: string[]): UserInputPlugin[] => {
  const userInputPlugins: UserInputPlugin[] = [];
  const config = readPluginsJson();

  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] !== '--name') {
      continue;
    }
    const groups = args[i + 1].match(PLUGIN_INPUT_PARSER_REGEX);
    if (!groups) {
      throw new Error('Unexpected plugin name format was provided');
    }

    const name = groups[1];
    const version = groups[2]; // later we'll use this for the @1.2.3 use case as well

    if (version === 'remote') {
      userInputPlugins.push({ name, remote: true });
      continue;
    } else if (version && semver.valid(version)) {
      userInputPlugins.push({ name, remote: true, version });
      continue;
    } else if (version) {
      throw new FlexPluginError(`The version \'${version}\' is not a valid semver.`);
    }

    const plugin = config.plugins.find((p) => p.name === name);
    if (!plugin && failIfNotFound) {
      throw new FlexPluginError(`No plugin file was found with the name \'${name}\'`);
    }
    if (plugin) {
      userInputPlugins.push({ name: plugin.name, remote: false });
    }
  }

  return userInputPlugins;
};

/**
 * Finds the first matched local plugin from provided CLI argument
 * @param plugins
 */
export const findFirstLocalPlugin = (plugins: UserInputPlugin[]): FlexConfigurationPlugin | undefined => {
  const localPlugin = plugins.find((p) => !p.remote);
  if (!localPlugin) {
    return undefined;
  }

  return readPluginsJson().plugins.find((p) => p.name === localPlugin.name);
};
