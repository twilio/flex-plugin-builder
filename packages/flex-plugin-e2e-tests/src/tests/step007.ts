/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import { logger } from '@twilio/flex-dev-utils';

import { assertion, joinPath, spawn } from '../utils';
import { TestSuite, TestParams } from '../core';

export const originalCode = 'const [isOpen, setIsOpen] = useState(true);';
export const codeWithViolation = `manager.store.getState().flex.session.loginHandler.on('tokenUpdated', (token) => {})\n  const [isOpen, setIsOpen] = useState(true);`;

// Validate plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];

  const ext = scenario.isTS ? 'tsx' : 'jsx';

  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: originalCode,
    to: codeWithViolation,
  });

  logger.info('Running {{twilio flex:plugins:validate}} on a plugin with validation issues');

  let result = await spawn('twilio', ['flex:plugins:validate', '-l', 'debug', ...config.regionFlag], {
    cwd: plugin.dir,
  });

  let noWarnings: number = result.stdout.match(/Warning:/)?.length || 0;

  assertion.equal(noWarnings, 1);

  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: codeWithViolation,
    to: originalCode,
  });

  logger.info('Running {{twilio flex:plugins:validate}} on a plugin with 0 validation issues');

  result = await spawn('twilio', ['flex:plugins:validate', '-l', 'debug', ...config.regionFlag], {
    cwd: plugin.dir,
  });
  noWarnings = result.stdout.match(/Warning:/)?.length || 0;

  assertion.equal(noWarnings, 0);
};

testSuite.description = 'Running {{twilio flex:plugins:validate}}';

export default testSuite;
