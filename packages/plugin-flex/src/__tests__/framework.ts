// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="../module.d.ts" />

import { services } from '@twilio/cli-core';
import { expect, test } from '@twilio/cli-test';
import { Config, ConfigData } from '@twilio/cli-core/src/services/config';
import { Logger } from 'flex-plugins-utils-logger';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { FancyTypes } from 'fancy-test';

export type SecureStorage = typeof services.secureStorage.SecureStorage;
chai.use(sinonChai);

interface Context<C> {
  userConfig: typeof ConfigData;
  config: typeof Config;
  testCmd: C;
}

type HelperTest<C> = FancyTypes.Base<
  FancyTypes.Context & Context<C>,
  {
    setup: {
      output: undefined;
      args: [(instance: C, ctx: FancyTypes.Context & Context<C>) => Promise<void> | void];
    };
    test: {
      output: undefined;
      args: [(instance: C, ctx: FancyTypes.Context & Context<C>, done: () => void) => Promise<void> | void];
    };
    mockLogger: {
      output: {
        testCmd: {
          _logger: Logger;
        };
      };
      args: [];
    };
  }
> &
  typeof test;

export const pluginTest = test
  .register('mockLogger', () => {
    return {
      async run(ctx) {
        if (!ctx.testCmd) {
          throw new Error("'mockLogger' must run after command has been created");
        }

        ctx.testCmd._logger.info = sinon.stub();
        ctx.testCmd._logger.notice = sinon.stub();
        ctx.testCmd._logger.warning = sinon.stub();
        ctx.testCmd._logger.error = sinon.stub();
        ctx.testCmd._logger.success = sinon.stub();
        ctx.testCmd._logger.debug = sinon.stub();
        ctx.testCmd._logger.trace = sinon.stub();
        ctx.testCmd._logger.newline = sinon.stub();

        // @ts-ignore
        ctx.testCmd._logger._log = sinon.stub();
      },
    };
  })
  .register('setup', (setup) => {
    return {
      async run(ctx) {
        if (!ctx.testCmd) {
          throw new Error("'setup' must run after command has been created");
        }

        await setup(ctx.testCmd, ctx);
      },
    };
  })
  .register('test', (fn) => {
    return {
      async run(ctx) {
        return new Promise(async (resolve, reject) => {
          if (!ctx.testCmd) {
            reject(new Error("'test' must run after command has been created"));
            return;
          }

          try {
            await fn(ctx.testCmd, ctx, resolve);
            if (fn.length < 3) {
              resolve();
            }
          } catch (e) {
            reject(e);
          }
        });
      },
    };
  });

/**
 * Creates a test for Command
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTest = <C>(command: new (...args: any[]) => C) => {
  return {
    sinon: sinon.createSandbox(),
    start: (args: string[] = []) => {
      // @ts-ignore
      return pluginTest
        .twilioFakeProfile(ConfigData)
        .twilioCliEnv(Config)
        .twilioCreateCommand(command, args)
        .mockLogger() as HelperTest<C>;
    },
  };
};

export { expect, sinon, test };
