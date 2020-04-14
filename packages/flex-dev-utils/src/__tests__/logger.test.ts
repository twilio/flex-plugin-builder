import { installInfo } from '../logger';
import * as logger from '../logger';

jest.mock('chalk');
jest.mock('wrap-ansi');

// tslint:disable
const chalk = require('chalk').default;
const wrapAnsi = require('wrap-ansi');
// tslint:enable

chalk.bold = chalk.bold || {};

describe('logger', () => {
  const OLD_ENV = process.env;

  const info = jest.fn();
  const warn = jest.fn();
  const error = jest.fn();

  const red = jest.fn();
  const yellow = jest.fn();
  const blue = jest.fn();
  const green = jest.fn();
  const boldGreen = jest.fn();
  const magenta = jest.fn();
  const cyan = jest.fn();

  chalk.cyan = cyan;
  chalk.bold.magenta = magenta;
  chalk.bold.green = boldGreen;
  chalk.red = red;
  chalk.yellow = yellow;
  chalk.blue = blue;
  chalk.green = green;

  global.console.info = info;
  global.console.warn = warn;
  global.console.error = error;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  it('should newline once', () => {
    const logInfo = jest.spyOn(logger, 'info');

    logger.newline();

    expect(logInfo).toHaveBeenCalledTimes(1);

    logInfo.mockRestore();
  });

  it('should newline three times', () => {
    const logInfo = jest.spyOn(logger, 'info');

    logger.newline(3);

    expect(logInfo).toHaveBeenCalledTimes(3);

    logInfo.mockRestore();
  });

  it('should log warning', () => {
    logger.warning('var1', 'var2');

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith('var1 var2');
    expect(yellow).toHaveBeenCalledTimes(1);
    expect(yellow).toHaveBeenCalledWith('var1 var2');
  });

  it('should log error', () => {
    logger.error('var1', 'var2');

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith('var1 var2');
    expect(red).toHaveBeenCalledTimes(1);
    expect(red).toHaveBeenCalledWith('var1 var2');
  });

  it('should log success', () => {
    logger.success('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
    expect(green).toHaveBeenCalledTimes(1);
    expect(green).toHaveBeenCalledWith('var1 var2');
  });

  it('should log info', () => {
    logger.info('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should notice info', () => {
    logger.notice('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should use installInfo', () => {
    logger.installInfo('cmd', 'arg1', 'arg2');

    expect(info).toHaveBeenCalledTimes(1);
  });

  it('should call debug if debug is set', () => {
    process.env.DEBUG = 'true';
    logger.debug('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should call debug if trace is set', () => {
    process.env.TRACE = 'true';
    logger.debug('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should not call debug if debug is not set', () => {
    logger.debug('var1', 'var2');

    expect(info).not.toHaveBeenCalled();
  });

  it('should call trace if TRACE is set', () => {
    process.env.TRACE = 'true';
    logger.trace('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should not call trace if TRACE is not set', () => {
    logger.trace('var1', 'var2');

    expect(info).not.toHaveBeenCalled();
  });

  describe('coloredStrings', () => {
    it('should call chalk blue', () => {
      logger.default.coloredStrings.link('some-text');

      expect(blue).toHaveBeenCalledTimes(1);
      expect(blue).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk green', () => {
      logger.default.coloredStrings.headline('some-text');

      expect(boldGreen).toHaveBeenCalledTimes(1);
      expect(boldGreen).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk green', () => {
      logger.default.coloredStrings.headline('some-text');

      expect(boldGreen).toHaveBeenCalledTimes(1);
      expect(boldGreen).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk bright magenta', () => {
      logger.default.coloredStrings.name('some-text');

      expect(magenta).toHaveBeenCalledTimes(1);
      expect(magenta).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk cyan', () => {
      logger.default.coloredStrings.digit('some-text');

      expect(cyan).toHaveBeenCalledTimes(1);
      expect(cyan).toHaveBeenCalledWith('some-text');
    });
  });

  describe('wrap', () => {
    it('should call wrapAnsi with default', () => {
      logger.wrap('input', 1);

      expect(wrapAnsi).toHaveBeenCalledTimes(1);
      expect(wrapAnsi).toHaveBeenCalledWith('input', 1, { hard: true });
    });

    it('should call wrapAnsi with overwrite', () => {
      logger.wrap('input', 1, { hard: false });

      expect(wrapAnsi).toHaveBeenCalledTimes(1);
      expect(wrapAnsi).toHaveBeenCalledWith('input', 1, { hard: false });
    });
  });
});
