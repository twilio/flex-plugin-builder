const { expect, test: oclifTest } = require('@twilio/cli-test');
const { Config, ConfigData } = require('@twilio/cli-core').services.config;
const sinon = require('sinon');
const chai = require('chai');

chai.use(require('sinon-chai'));

const pluginTest = oclifTest
  .register('mockLogger', () => {
    return {
      async run(ctx) {
        ctx.testCmd._logger.info = sinon.stub();
        ctx.testCmd._logger.notice = sinon.stub();
        ctx.testCmd._logger.warning = sinon.stub();
        ctx.testCmd._logger.error = sinon.stub();
        ctx.testCmd._logger.success = sinon.stub();
        ctx.testCmd._logger.debug = sinon.stub();
        ctx.testCmd._logger.trace = sinon.stub();
        ctx.testCmd._logger.newline = sinon.stub();
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
  .register('test', (test) => {
    return {
      async run(ctx) {
        return new Promise(async (resolve) => {
          if (test.length < 3) {
            resolve();
          }
          await test(ctx.testCmd, ctx, resolve);
        });
      },
    };
  });

/**
 * Creates a test for Command
 */
const createTest = (Command) => {
  return {
    sinon: sinon.createSandbox(),
    start: (args = []) => {
      return pluginTest
        .twilioFakeProfile(ConfigData)
        .twilioCliEnv(Config)
        .twilioCreateCommand(Command, args)
        .mockLogger();
    },
  };
};

module.exports = {
  test: oclifTest,
  createTest,
  expect,
  sinon,
};
