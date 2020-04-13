import { env, logger } from 'flex-dev-utils';
import { checkFilesExist, findGlobs } from 'flex-dev-utils/dist/fs';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import { typescriptNotInstalled } from '../prints';
import paths from './paths';
import { exit } from './run';

export const hasTypescriptFiles = () => findGlobs('**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts').length !== 0;

export default () => {
  if (!hasTypescriptFiles()) {
    return;
  }

  if (!resolveModulePath('typescript')) {
    typescriptNotInstalled();
    exit(1);

    return;
  }

  if (checkFilesExist(paths.tsConfigPath)) {
    return;
  }

  env.persistTerminal();
  logger.warning('No tsconfig.json was found, creating a default one.');
  // TODO: actually do this!
};
