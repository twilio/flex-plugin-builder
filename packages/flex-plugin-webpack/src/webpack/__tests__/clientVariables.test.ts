import { env } from 'flex-dev-utils';
import * as fs from 'flex-dev-utils/dist/fs';
import dotenv from 'dotenv';

import * as prints from '../../prints';
import * as clientVariables from '../clientVariables';

describe('clientVariables', () => {
  const processEnvName = 'process.env';
  const OLD_ENV = process.env;
  const hasEnvFile = jest.fn();
  const vars = {
    BAD_SECRET: 'ignored',
    FLEX_APP_VAR1: 'flex-variable',
    REACT_APP_VAR2: 'react-variable',
  };
  const paths = {
    app: {
      name: 'test',
      version: '1.2.3',
      buildDir: 'the/build/dir',
      publicDir: 'the/public/dir',
      envPath: 'the/.env',
      hasEnvFile,
    },
  };
  const verifyVariables = (variables: Record<string, unknown>) => {
    expect(variables.FLEX_APP_VAR1).toEqual(`"${vars.FLEX_APP_VAR1}"`);
    expect(variables.REACT_APP_VAR2).toEqual(`"${vars.REACT_APP_VAR2}"`);
    expect(variables.BAD_SECRET).toBeUndefined();
  };

  beforeEach(() => {
    process.env = { ...OLD_ENV };

    jest.restoreAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('getSanitizedProcessEnv', () => {
    const profile = 'test-profile';

    it('should only return process.env and no .env files', () => {
      process.env = vars;

      jest.spyOn(clientVariables, '_readEnvFile');
      const variables = clientVariables.getSanitizedProcessEnv()[processEnvName];

      verifyVariables(variables);
      expect(clientVariables._readEnvFile).not.toHaveBeenCalled();
    });

    it('should read .env file if provided', () => {
      hasEnvFile.mockReturnValue(true);
      jest.spyOn(clientVariables, '_readEnvFile').mockReturnValue(vars);

      const variables = clientVariables.getSanitizedProcessEnv()[processEnvName];
      verifyVariables(variables);
      expect(clientVariables._readEnvFile).toHaveBeenCalledTimes(1);
      expect(clientVariables._readEnvFile).toHaveBeenCalledWith('.env', paths.app.envPath);
    });

    it('should not read profile.env if profile is provided but no file found', () => {
      hasEnvFile.mockReturnValue(false);
      jest.spyOn(env, 'getTwilioProfile').mockReturnValue(profile);
      jest.spyOn(fs, 'resolveRelative').mockReturnValue(`/.${profile}.env`);
      jest.spyOn(fs, 'checkAFileExists').mockReturnValue(false);
      jest.spyOn(clientVariables, '_readEnvFile');

      clientVariables.getSanitizedProcessEnv();
      expect(clientVariables._readEnvFile).not.toHaveBeenCalled();
      expect(fs.checkAFileExists).toHaveBeenCalled();
    });

    it('should read profile.env ', () => {
      hasEnvFile.mockReturnValue(false);
      jest.spyOn(env, 'getTwilioProfile').mockReturnValue(profile);
      jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
      jest.spyOn(fs, 'resolveRelative').mockReturnValue(`/.${profile}.env`);
      jest.spyOn(clientVariables, '_readEnvFile').mockReturnValue(vars);

      const variables = clientVariables.getSanitizedProcessEnv()[processEnvName];
      verifyVariables(variables);
      expect(clientVariables._readEnvFile).toHaveBeenCalledTimes(1);
      expect(clientVariables._readEnvFile).toHaveBeenCalledWith(`.${profile}.env`, `/.${profile}.env`);
    });

    it('should overwrite .env by profile.env duplicate and keep all', () => {
      const envVars = {
        FLEX_APP_VAR_REPLACE: 'original',
        FLEX_APP_ANOTHER: 'another',
      };
      const profileVars = {
        FLEX_APP_VAR_REPLACE: 'replaced',
        FLEX_APP_VAR: 'var',
      };
      jest.spyOn(env, 'getTwilioProfile').mockReturnValue(profile);
      hasEnvFile.mockReturnValue(true);
      jest.spyOn(fs, 'checkAFileExists').mockReturnValue(true);
      jest.spyOn(fs, 'resolveRelative').mockReturnValue(`/.${profile}.env`);
      jest.spyOn(clientVariables, '_readEnvFile').mockImplementation((filename) => {
        if (filename === '.env') {
          return envVars;
        }

        return profileVars;
      });

      const variables = clientVariables.getSanitizedProcessEnv()[processEnvName];
      expect(variables.FLEX_APP_VAR_REPLACE).toEqual('"replaced"');
      expect(variables.FLEX_APP_ANOTHER).toEqual(`"${envVars.FLEX_APP_ANOTHER}"`);
      expect(variables.FLEX_APP_VAR).toEqual(`"${profileVars.FLEX_APP_VAR}"`);
    });
  });

  describe('_filterVariables', () => {
    it('should filter variables', () => {
      const variables = clientVariables._filterVariables(vars);

      verifyVariables(variables);
    });
  });

  describe('_readEnvFile', () => {
    it('should parse file and log warning', () => {
      jest.spyOn(dotenv, 'parse').mockReturnValue(vars);
      jest.spyOn(prints, 'dotEnvIncorrectVariable').mockReturnThis();
      jest.spyOn(fs, 'readFileSync').mockReturnValue('data');
      const variables = clientVariables._readEnvFile('.env', 'the/path');

      expect(variables.FLEX_APP_VAR1).toEqual(vars.FLEX_APP_VAR1);
      expect(variables.REACT_APP_VAR2).toEqual(vars.REACT_APP_VAR2);
      expect(variables.BAD_SECRET).toEqual(vars.BAD_SECRET);
      expect(prints.dotEnvIncorrectVariable).toHaveBeenCalledTimes(1);
      expect(prints.dotEnvIncorrectVariable).toHaveBeenCalledWith('.env', 'BAD_SECRET');
    });
  });
});
