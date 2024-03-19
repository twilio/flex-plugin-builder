/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import { logger } from '@twilio/flex-dev-utils';

import { assertion, joinPath, spawn, api } from '../utils';
import { TestSuite, TestParams } from '../core';
import { WARNING_REGEX, codeWithViolation, originalCode } from './step007';

// Deploy plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  const ext = scenario.isTS ? 'tsx' : 'jsx';
  plugin.newlineValue = `This is a dismissible demo component ${Date.now()}`;
  plugin.changelog = `e2e test ${Date.now()}`;

  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: plugin.newlineValue,
  });

  // Deploy with validation errors in the plugin with option fix
  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: originalCode,
    to: codeWithViolation,
  });

  logger.info('Running {{flex:plugins:deploy}} with --option {{fix}}');

  let result = await spawn(
    'twilio',
    [
      'flex:plugins:deploy',
      '--changelog',
      `"${plugin.changelog}"`,
      '--patch',
      '--option',
      'fix',
      '-l',
      'debug',
      ...config.regionFlag,
    ],
    {
      cwd: plugin.dir,
    },
  );

  let noWarnings: number = result.stdout.match(WARNING_REGEX)?.length || 0;

  // Should display violations
  assertion.equal(noWarnings, 2);

  // Should not deploy the plugin
  assertion.not.stringContains(result.stdout, 'Next Steps');
  assertion.not.stringContains(result.stdout, 'twilio flex:plugins:release');

  // Deploy with validation errors in the plugin with option deploy
  logger.info('Running {{flex:plugins:deploy}} with --option {{deploy}}');

  result = await spawn(
    'twilio',
    [
      'flex:plugins:deploy',
      '--changelog',
      `"${plugin.changelog}"`,
      '--patch',
      '--option',
      'deploy',
      '-l',
      'debug',
      ...config.regionFlag,
    ],
    {
      cwd: plugin.dir,
    },
  );

  noWarnings = result.stdout.match(WARNING_REGEX)?.length || 0;

  // Should display violations
  assertion.equal(noWarnings, 2);

  // Should deploy the plugin
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');

  // Deploy without validation errors in the plugin
  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: codeWithViolation,
    to: originalCode,
  });

  logger.info('Running {{flex:plugins:deploy}} on a plugin with 0 valdiation issues');
  result = await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${plugin.changelog}"`, '--patch', '-l', 'debug', ...config.regionFlag],
    {
      cwd: plugin.dir,
    },
  );

  // Get the latest plugin version after all the plugin deployments
  const resource = await api.getLatestPluginVersion(plugin.name);
  plugin.version = resource?.version || '0.0.2'; // 0.0.2 is the default for first time plugin deployment in a Flex account

  noWarnings = result.stdout.match(WARNING_REGEX)?.length || 0;

  // Should display 0 violations
  assertion.equal(noWarnings, 0);

  // Should deploy plugin
  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js`]);
  assertion.fileContains([plugin.dir, 'build', `${plugin.name}.js`], plugin.newlineValue);
  assertion.jsonFileContains([plugin.dir, 'package.json'], 'version', plugin.version);
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
  assertion.stringContains(result.stdout, plugin.name);

  const apiPlugin = await api.getPlugin(plugin.name);
  const pluginVersion = await api.getPluginVersion(plugin.name, plugin.version);
  const latest = await api.getLatestPluginVersion(plugin.name);

  assertion.equal(apiPlugin.unique_name, plugin.name);
  assertion.equal(pluginVersion.version, plugin.version);
  assertion.equal(pluginVersion.changelog, plugin.changelog);
  assertion.equal(pluginVersion, latest);
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';

export default testSuite;
