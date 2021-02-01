// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../module.d.ts" />

import OClifConfig from '@oclif/config';
import { Config, ConfigData } from '@twilio/cli-core/src/services/config';
import tmp, { DirResult } from 'tmp';
import { Logger } from 'flex-plugins-utils-logger';

import * as fs from '../utils/fs';
import FlexPlugin from '../sub-commands/flex-plugin';

interface Context {
  tmpDir?: DirResult;
}

const constants = {
  FAKE_ACCOUNT_SID: 'AC00000000000000000000000000000',
  FAKE_API_KEY: 'SK00000000000000000000000000000',
  FAKE_API_SECRET: 'fake password',
};

const context: Context = {};

const getTmpDirectory = () => {
  if (!context.tmpDir) {
    context.tmpDir = tmp.dirSync({ unsafeCleanup: true });
  }

  return context.tmpDir;
};

const removeTmpDirectory = () => {
  if (context.tmpDir) {
    context.tmpDir.removeCallback();

    delete context.tmpDir;
  }
};

const mockLogger = async <C extends FlexPlugin>(command: C): Promise<C> => {
  const mock = (method: keyof Logger) => {
    // @ts-ignore;
    jest.spyOn(command._logger, method).mockReturnThis();
  };
  const keys = ['info', 'notice', 'warning', 'error', 'success', 'debug', 'trace', 'newline'] as (keyof Logger)[];
  keys.forEach(mock);

  jest.spyOn(process.stderr, 'write').mockReturnThis();

  return command;
};

const mockUserConfig = async <C extends FlexPlugin>(command: C): Promise<C> => {
  // @ts-ignore
  command.userConfig = new ConfigData();
  // @ts-ignore
  command.userConfig.addProfile('default', constants.FAKE_ACCOUNT_SID);

  return command;
};

const mockEnv = async <C extends FlexPlugin>(command: C): Promise<C> => {
  // Clear env
  Object.keys(process.env)
    // eslint-disable-next-line prefer-named-capture-group
    .filter((k) => k.match(/^(TWILIO|SENDGRID)_/))
    .forEach((k) => delete process.env[k]);

  return command;
};

const mockSecureStorage = async <C extends FlexPlugin>(command: C): Promise<C> => {
  // @ts-ignore
  command.secureStorage = {
    getCredentials: jest.fn().mockImplementation((id: string) => ({
      apiKey: constants.FAKE_API_KEY,
      apiSecret: constants.FAKE_API_SECRET + id,
    })),
    saveCredentials: jest.fn().mockResolvedValue(true),
    storageLocation: 'libsecret',
  };

  return command;
};

const mockConfig = async <C extends FlexPlugin>(command: C): Promise<C> => {
  const tmpDir = getTmpDirectory();

  // @ts-ignore
  if (!command.config) {
    // @ts-ignore
    command.config = await OClifConfig.load();
  }
  // @ts-ignore
  command.config.configDir = tmpDir.name;

  // @ts-ignore
  const tempConfig = new Config(tmpDir.name);
  // @ts-ignore
  await tempConfig.save(command.userConfig);

  return command;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTest = <C extends FlexPlugin>(Command: new (...argv: any[]) => C) => async (
  ...args: string[]
): Promise<C> => {
  return Promise.resolve(new Command(args, ConfigData))
    .then(async (c) => mockSecureStorage(c))
    .then(async (c) => mockUserConfig(c))
    .then(async (c) => mockEnv(c))
    .then(async (c) => mockLogger(c))
    .then(async (c) => mockConfig(c));
};

afterEach(() => {
  removeTmpDirectory();
});

/**
 * Mocks the this.pkg
 * @param cmd the command
 * @param obj the package response
 */
export const mockGetPkg = (cmd: FlexPlugin, obj: Record<string, unknown>) => {
  // @ts-ignore;
  return jest.spyOn(cmd, 'pkg', 'get').mockReturnValue(obj);
};

/**
 * Mocks a cmd.prints method
 * @param cmd the command
 * @param method the print method to mock
 */
export const mockPrintMethod = <C extends FlexPlugin>(cmd: C, method: string) => {
  // @ts-ignore
  jest.spyOn(cmd.prints, method).mockReturnThis();
};

/**
 * Returns the print method
 * @param cmd the command
 * @param method the print method to return
 */
export const getPrintMethod = <C extends FlexPlugin>(cmd: C, method: string) => {
  // @ts-ignore
  return cmd.prints[method];
};

/**
 * Mocks the getter partially
 * @param cmd the command
 * @param property  the get property
 * @param methods the partial methods
 */
export const mockGetter = <C extends FlexPlugin, P extends keyof C, M extends C[P]>(
  cmd: C,
  property: P,
  methods: Partial<M>,
) => {
  // @ts-ignore
  jest.spyOn(cmd, property, 'get').mockReturnValue(methods);
};

/**
 * Mocks fileExists by implementing that input and output match exactly
 * @param output
 */
export const implementFileExists = (...output: string[]) => {
  jest.spyOn(fs, 'fileExists').mockImplementation((...input: string[]) => {
    return input.length === output.length && input.every((item, index) => output[index] === item);
  });
};

export default createTest;
