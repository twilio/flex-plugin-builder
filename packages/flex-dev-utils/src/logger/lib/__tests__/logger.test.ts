/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
import logger, { _logger, Logger, coloredStrings } from '../logger';

jest.mock('wrap-ansi');
jest.mock('@twilio/flex-plugins-utils-env');
jest.mock('chalk', () => {
  const bold = jest.fn();
  // @ts-ignore
  bold.magenta = jest.fn();
  // @ts-ignore
  bold.green = jest.fn();

  return {
    bold,
    italic: jest.fn(),
    cyan: jest.fn(),
    red: jest.fn(),
    yellow: jest.fn(),
    blue: jest.fn(),
    green: jest.fn(),
    magenta: jest.fn(),
    dim: jest.fn(),
  };
});

const chalk = require('chalk');
const wrapAnsi = require('wrap-ansi');
const env = require('@twilio/flex-plugins-utils-env').default;

describe('logger', () => {
  const info = jest.fn();
  const warn = jest.fn();
  const error = jest.fn();

  const bold = jest.spyOn(chalk, 'bold');
  const boldGreen = jest.spyOn(chalk.bold, 'green');
  const boldMagenta = jest.spyOn(chalk.bold, 'magenta');
  const italic = jest.spyOn(chalk, 'italic');
  const yellow = jest.spyOn(chalk, 'yellow');
  const blue = jest.spyOn(chalk, 'blue');
  const green = jest.spyOn(chalk, 'green');
  const cyan = jest.spyOn(chalk, 'cyan');
  const red = jest.spyOn(chalk, 'red');
  const magenta = jest.spyOn(chalk, 'magenta');
  const dim = jest.spyOn(chalk, 'dim');

  global.console.info = info;
  global.console.warn = warn;
  global.console.error = error;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    red.mockImplementation((msg) => msg);
    yellow.mockImplementation((msg) => msg);
    green.mockImplementation((msg) => msg);
    cyan.mockImplementation((msg) => msg);
    blue.mockImplementation((msg) => msg);
    magenta.mockImplementation((msg) => msg);
    boldMagenta.mockImplementation((msg) => msg);
    boldGreen.mockImplementation((msg) => msg);
    bold.mockImplementation((msg) => msg);
    italic.mockImplementation((msg) => msg);
    dim.mockImplementation((msg) => msg);
  });

  it('should newline once', () => {
    const logInfo = jest.spyOn(_logger, 'info');

    logger.newline();

    expect(logInfo).toHaveBeenCalledTimes(1);

    logInfo.mockRestore();
  });

  it('should newline three times', () => {
    const logInfo = jest.spyOn(_logger, 'info');

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

  it('should print single entry column', () => {
    logger.columns([['one-entry']]);

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('one-entry');
  });

  it('should print multile entries with no indent', () => {
    logger.columns([
      ['row1-col1', 'row1-col2'],
      ['row2-col1', 'row2-col2'],
    ]);

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row1-col1'));
    expect(info).not.toHaveBeenCalledWith(expect.stringContaining('\trow1-col1'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row1-col2'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row2-col1'));
    expect(info).not.toHaveBeenCalledWith(expect.stringContaining('\trow2-col1'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row2-col2'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('\n'));
  });

  it('should print multile entries with indent', () => {
    logger.columns(
      [
        ['row1-col1', 'row1-col2'],
        ['row2-col1', 'row2-col2'],
      ],
      { indent: true },
    );

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith(expect.stringContaining('\trow1-col1'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row1-col2'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('\trow2-col1'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('row2-col2'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('\n'));
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
    jest.spyOn(env, 'isDebug').mockReturnValue(true);
    logger.debug('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  it('should not call debug if debug is not set', () => {
    logger.debug('var1', 'var2');

    expect(info).not.toHaveBeenCalled();
  });

  it('should not call trace if TRACE is not set', () => {
    logger.trace('var1', 'var2');

    expect(info).not.toHaveBeenCalled();
  });

  it('should call trace if TRACE is set', () => {
    jest.spyOn(env, 'isTrace').mockReturnValue(true);
    logger.trace('var1', 'var2');

    expect(info).toHaveBeenCalledTimes(1);
    expect(info).toHaveBeenCalledWith('var1 var2');
  });

  describe('coloredStrings', () => {
    it('should call chalk blue', () => {
      coloredStrings.link('some-text');

      expect(cyan).toHaveBeenCalledTimes(1);
      expect(cyan).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk green', () => {
      coloredStrings.headline('some-text');

      expect(boldGreen).toHaveBeenCalledTimes(1);
      expect(boldGreen).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk bright magenta', () => {
      coloredStrings.name('some-text');

      expect(boldMagenta).toHaveBeenCalledTimes(1);
      expect(boldMagenta).toHaveBeenCalledWith('some-text');
    });

    it('should call chalk cyan', () => {
      coloredStrings.digit('some-text');

      expect(magenta).toHaveBeenCalledTimes(1);
      expect(magenta).toHaveBeenCalledWith('some-text');
    });

    describe('markdown', () => {
      it('should not do anything if no markdown required', () => {
        expect(logger.markdown()).toBeUndefined();
        expect(logger.markdown('')).toEqual('');
        expect(logger.markdown('text with no markdown')).toEqual('text with no markdown');

        expect(bold).not.toHaveBeenCalled();
        expect(italic).not.toHaveBeenCalled();
        expect(magenta).not.toHaveBeenCalled();
      });

      it('should do just bold', () => {
        expect(logger.markdown('text with **bold word** markdown')).toEqual('text with bold word markdown');

        expect(bold).toHaveBeenCalledTimes(1);
        expect(bold).toHaveBeenCalledWith('bold word');
      });

      it('should do just italic', () => {
        expect(logger.markdown('text with _italic word_ markdown')).toEqual('text with italic word markdown');

        expect(italic).toHaveBeenCalledTimes(1);
        expect(italic).toHaveBeenCalledWith('italic word');
      });

      it('should do italic and bold', () => {
        expect(logger.markdown('text **with** _everything_ and _anything_ **that** can be')).toEqual(
          'text with everything and anything that can be',
        );

        expect(bold).toHaveBeenCalledTimes(2);
        expect(bold).toHaveBeenCalledWith('with');
        expect(bold).toHaveBeenCalledWith('that');
        expect(italic).toHaveBeenCalledTimes(2);
        expect(italic).toHaveBeenCalledWith('everything');
        expect(italic).toHaveBeenCalledWith('anything');
      });

      it('should do code syntax', () => {
        expect(logger.markdown('text with {{code syntax}} markdown')).toEqual('text with code syntax markdown');

        expect(magenta).toHaveBeenCalledTimes(1);
        expect(magenta).toHaveBeenCalledWith('code syntax');
      });

      it('should do link syntax', () => {
        expect(logger.markdown('text with [[link syntax]] markdown')).toEqual('text with link syntax markdown');

        expect(cyan).toHaveBeenCalledTimes(1);
        expect(cyan).toHaveBeenCalledWith('link syntax');
      });

      it('should do success syntax', () => {
        expect(logger.markdown('text with ++success syntax++ markdown')).toEqual('text with success syntax markdown');

        expect(green).toHaveBeenCalledTimes(1);
        expect(green).toHaveBeenCalledWith('success syntax');
      });

      it('should do error syntax', () => {
        expect(logger.markdown('text with --error syntax-- markdown')).toEqual('text with error syntax markdown');

        expect(red).toHaveBeenCalledTimes(1);
        expect(red).toHaveBeenCalledWith('error syntax');
      });

      it('should do warning syntax', () => {
        expect(logger.markdown('text with !!warning syntax!! markdown')).toEqual('text with warning syntax markdown');

        expect(yellow).toHaveBeenCalledTimes(1);
        expect(yellow).toHaveBeenCalledWith('warning syntax');
      });

      it('should do dim syntax', () => {
        expect(logger.markdown('text in ..dim syntax.. markdown')).toEqual('text in dim syntax markdown');

        expect(dim).toHaveBeenCalledTimes(1);
        expect(dim).toHaveBeenCalledWith('dim syntax');
      });

      it('should do info syntax', () => {
        expect(logger.markdown('text in @@info syntax@@ markdown')).toEqual('text in info syntax markdown');

        expect(blue).toHaveBeenCalledTimes(1);
        expect(blue).toHaveBeenCalledWith('info syntax');
      });

      it('should escape characters', () => {
        expect(logger.markdown('text with \\-\\-escaped error\\-\\- markdown')).toEqual(
          'text with --escaped error-- markdown',
        );

        expect(red).not.toHaveBeenCalled();
      });
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

  describe('Logger', () => {
    it('should use debug mode even if env var is not', () => {
      jest.spyOn(env, 'isDebug').mockReturnValue(false);
      const instance = new Logger({ isDebug: true });

      instance.debug('var1', 'var2');

      expect(info).toHaveBeenCalledTimes(1);
      expect(info).toHaveBeenCalledWith('var1 var2');
      expect(env.isDebug).not.toHaveBeenCalled();
    });

    it('should not use debug mode even if env var is', () => {
      jest.spyOn(env, 'isDebug').mockReturnValue(true);
      const instance = new Logger({ isDebug: false });

      instance.debug('var1', 'var2');

      expect(info).not.toHaveBeenCalled();
      expect(env.isDebug).not.toHaveBeenCalled();
    });

    describe('isDebug', () => {
      it('isDebug should return true from the option', () => {
        const instance = new Logger({ isDebug: true });

        // @ts-ignore
        expect(instance.isDebug()).toEqual(true);
        expect(env.isDebug).not.toHaveBeenCalled();
      });

      it('isDebug should return false from the option', () => {
        jest.spyOn(env, 'isDebug').mockReturnValue(true);
        const instance = new Logger({ isDebug: false });

        // @ts-ignore
        expect(instance.isDebug()).toEqual(false);
        expect(env.isDebug).not.toHaveBeenCalled();
      });

      it('isDebug should return true from env var', () => {
        jest.spyOn(env, 'isDebug').mockReturnValue(true);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isDebug()).toEqual(true);
        expect(env.isDebug).toHaveBeenCalledTimes(1);
      });

      it('isDebug should return false from env var', () => {
        jest.spyOn(env, 'isDebug').mockReturnValue(false);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isDebug()).toEqual(false);
        expect(env.isDebug).toHaveBeenCalledTimes(1);
      });
    });

    describe('isTrace', () => {
      it('should return true from the option', () => {
        jest.spyOn(env, 'isTrace').mockReturnValue(false);
        const instance = new Logger({ isTrace: true });

        // @ts-ignore
        expect(instance.isTrace()).toEqual(true);
        expect(env.isTrace).not.toHaveBeenCalled();
      });

      it('should return false from the option', () => {
        jest.spyOn(env, 'isTrace').mockReturnValue(true);
        const instance = new Logger({ isTrace: false });

        // @ts-ignore
        expect(instance.isTrace()).toEqual(false);
        expect(env.isTrace).not.toHaveBeenCalled();
      });

      it('should return true from env var', () => {
        jest.spyOn(env, 'isTrace').mockReturnValue(true);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isTrace()).toEqual(true);
        expect(env.isTrace).toHaveBeenCalledTimes(1);
      });

      it('should return false from env var', () => {
        jest.spyOn(env, 'isTrace').mockReturnValue(false);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isTrace()).toEqual(false);
        expect(env.isTrace).toHaveBeenCalledTimes(1);
      });
    });

    describe('isQuiet', () => {
      it('should return true from the option', () => {
        jest.spyOn(env, 'isQuiet').mockReturnValue(false);
        const instance = new Logger({ isQuiet: true });

        // @ts-ignore
        expect(instance.isQuiet()).toEqual(true);
        expect(env.isQuiet).not.toHaveBeenCalled();
      });

      it('should return false from the option', () => {
        jest.spyOn(env, 'isQuiet').mockReturnValue(true);
        const instance = new Logger({ isQuiet: false });

        // @ts-ignore
        expect(instance.isQuiet()).toEqual(false);
        expect(env.isQuiet).not.toHaveBeenCalled();
      });

      it('should return true from env var', () => {
        jest.spyOn(env, 'isQuiet').mockReturnValue(true);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isQuiet()).toEqual(true);
        expect(env.isQuiet).toHaveReturnedTimes(1);
      });

      it('should return false from env var', () => {
        jest.spyOn(env, 'isQuiet').mockReturnValue(false);
        const instance = new Logger();

        // @ts-ignore
        expect(instance.isQuiet()).toEqual(false);
        expect(env.isQuiet).toHaveReturnedTimes(1);
      });
    });

    describe('_log', () => {
      it('should not log if quiet and info level', () => {
        const instance = new Logger({ isQuiet: true });

        // @ts-ignore
        instance._log({ level: 'info', args: ['blah'] });
        expect(info).not.toHaveBeenCalled();
      });

      it('should log if quiet but is also debug', () => {
        jest.spyOn(env, 'isDebug').mockReturnValue(true);
        const instance = new Logger({ isQuiet: true });

        // @ts-ignore
        instance._log({ level: 'info', args: ['blah'] });
        expect(info).toHaveBeenCalledTimes(1);
      });

      it('should not log if quiet and warning level', () => {
        const instance = new Logger({ isQuiet: true });

        // @ts-ignore
        instance._log({ level: 'warn', args: ['blah'] });
        expect(warn).not.toHaveBeenCalled();
      });

      it('should log even if quiet but error level', () => {
        const instance = new Logger({ isQuiet: true });

        // @ts-ignore
        instance._log({ level: 'error', args: ['blah'] });
        expect(error).toHaveBeenCalledTimes(1);
      });
    });
  });
});
