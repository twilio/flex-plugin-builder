/* eslint-disable import/no-unused-modules */
import { logger } from '@twilio/flex-dev-utils';
import { readPackageJson, writeJSONFile } from '@twilio/flex-dev-utils/dist/fs';

import { TestSuite, TestParams } from '../core';
import { spawn, assertion, joinPath } from '../utils';

// Install dependencies
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  if (scenario.flexUIVersion) {
    logger.info('Installing custom flex-ui version', scenario.flexUIVersion);
    const pkgPath = joinPath(plugin.dir, 'package.json');
    const pkg = readPackageJson(pkgPath);
    pkg.devDependencies['@twilio/flex-ui'] = scenario.flexUIVersion;
    writeJSONFile(pkg, pkgPath);
  } else {
    logger.info('Installing latest flex-ui version');
  }

  await spawn('npm', ['i'], { cwd: plugin.dir });

  assertion.fileExists([plugin.dir, 'node_modules']);
  assertion.fileExists([plugin.dir, 'node_modules', '@twilio/flex-plugin-scripts']);
  assertion.jsonFileContains(
    [plugin.dir, 'node_modules', '@twilio/flex-plugin-scripts', 'package.json'],
    'version',
    scenario.packageVersion,
  );
};
testSuite.description = 'Running {{npm i}}';

export default testSuite;
