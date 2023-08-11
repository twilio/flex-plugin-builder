import dotenv from 'dotenv';
import { readFileSync, getPaths, resolveRelative, checkAFileExists } from '@twilio/flex-dev-utils/dist/fs';
import { env } from '@twilio/flex-dev-utils';
import { DefinePlugin } from 'webpack';

import { dotEnvIncorrectVariable } from '../prints';

type CodeValueObject = {
  [key: string]: any;
};
type ProcessEnv = {
  [key: string]: string | undefined;
};
interface SanitizedProcessEnv {
  'process.env': CodeValueObject;
}

const REACT_APP_REGEX = /^REACT_APP_/i;
const FLEX_APP_REGEX = /^FLEX_APP_/i;

/**
 * Checks whether the variable is of correct format
 * @param key
 */
const isValid = (key: string): boolean => FLEX_APP_REGEX.test(key) || REACT_APP_REGEX.test(key);

/**
 * Reads the .env file and process it. It will print warning messages if the format is invalid
 * @param filename  the filename to read
 * @param path      the path to the file
 */
const _readEnvFile = (filename: string, path: string): ProcessEnv => {
  const newVars = dotenv.parse(readFileSync(path));
  Object.keys(newVars)
    .filter((key: string) => !isValid(key))
    .forEach((key: string) => dotEnvIncorrectVariable(filename, key));

  return newVars;
};

/**
 * Filters and sanitizes the variables
 * @param variables the variables to read
 */
const _filterVariables = (variables: CodeValueObject): CodeValueObject => {
  return Object.keys(variables)
    .filter(isValid)
    .reduce((newEnvs: CodeValueObject, key: string) => {
      newEnvs[key] = JSON.stringify(variables[key]);
      return newEnvs;
    }, {});
};

/**
 * Reads the .env files and sanitizes and only returns allowed keys
 */
export const getSanitizedProcessEnv = (): SanitizedProcessEnv => {
  const { app: appPaths, cwd } = getPaths();
  let { env: variables } = process;

  // Support .env file if provided
  if (appPaths.hasEnvFile()) {
    variables = { ...variables, ..._readEnvFile('.env', appPaths.envPath) };
  }
  // Support for profile specific .env file (this should come after .env to allow overwrite)
  if (env.getTwilioProfile()) {
    const filename = `.${env.getTwilioProfile()}.env`;
    const profileEnvPath = resolveRelative(cwd, `/${filename}`);
    if (checkAFileExists(profileEnvPath)) {
      variables = { ...variables, ..._readEnvFile(filename, profileEnvPath) };
    }
  }

  return {
    'process.env': _filterVariables(variables),
  };
};
