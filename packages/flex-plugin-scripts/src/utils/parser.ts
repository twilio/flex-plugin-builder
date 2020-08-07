import { FlexConfigurationPlugin, readPluginsJson } from 'flex-dev-utils/dist/fs';
import { FlexPluginError } from 'flex-dev-utils';

const PLUGIN_INPUT_PARSER_REGEX = /([\w-]+)(?:@(\S+))?/;

export interface UserInputPlugin {
  name: string;
  remote: boolean;
  version?: string;
}

/**
 * Reads user input to returns the --name plugins
 * --name plugin-test will run plugin-test locally
 * --name plugin-test@remote will run plugin-test remotely
 * --include-remote will include all remote plugins
 * @param args
 */
export const parseUserInputPlugins = (...args: string[]): UserInputPlugin[] => {
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
      userInputPlugins.push({name, remote: true});
      continue;
    }

    const plugin = config.plugins.find((p) => p.name === name);
    if (!plugin) {
      throw new FlexPluginError(`No plugin file was found with the name \'${name}\'`);
    }
    userInputPlugins.push({name: plugin.name, remote: false});
  }

  return userInputPlugins;
};

/**
 * Finds the first matched local plugin from provided CLI argument
 * @param plugins
 */
export const findFirstLocalPlugin = (plugins: UserInputPlugin[]): FlexConfigurationPlugin | undefined => {
  const localPlugin = plugins.find(p => !p.remote);
  if (!localPlugin) {
    return undefined;
  }

  return readPluginsJson().plugins.find((p) => p.name === localPlugin.name);
}
