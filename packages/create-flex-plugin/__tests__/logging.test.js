import * as log from '../src/logging';
import * as symbols from 'log-symbols';
import chalk from 'chalk';

describe('logging', () => {
  // Mocking the console object
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
  }

  beforeEach(() => jest.clearAllMocks());

  describe('error', () => {
    const SYMBOL_ERROR = symbols.error;
    const ERROR = chalk.bold('ERROR');

    test(`should return a 'console.error' message`, () => {
      // Arrange
      const errorMessage = 'Error message';
      const expectedMessage = `${SYMBOL_ERROR} ${ERROR} ${errorMessage}`;

      // Act
      log.error(errorMessage);

      // Assert
      expect(console.error).toHaveBeenCalledWith(expectedMessage);
    });

    test(`should accept any number of arguments`, () => {
      // Arrange
      const errorMessage = 'Error message';
      const arg1 = 'argument #1';
      const arg2 = 'argument #2';
      const args = [arg1, arg2];
      const expectedMessage = `${SYMBOL_ERROR} ${ERROR} ${errorMessage}`;

      // Act
      log.error(errorMessage, ...args);

      // Assert
      expect(console.error).toHaveBeenCalledWith(expectedMessage, ...args);
    });
  });

  describe('finalMessage', () => {
    test(`should render an 'npm' setup message to the console`, () => {
      // Arrange
      let message;
      console.log = jest.fn((msg) => message = msg);

      // Act
      log.finalMessage({});

      // Assert
      expect(console.log).toHaveBeenCalled();
      expect(message).toMatchSnapshot();
    });

    test(`should render a 'yarn' setup message to the console`, () => {
      // Arrange
      let message;
      console.log = jest.fn((msg) => message = msg);

      // Act
      log.finalMessage({yarn: true});

      // Assert
      expect(console.log).toHaveBeenCalled();
      expect(message).toMatchSnapshot();
    });

    test(`should render an instruction message skipping the setup step`, () => {
      // Arrange
      let message;
      console.log = jest.fn((msg) => message = msg);

      // Act
      log.finalMessage({install: true});

      // Assert
      expect(console.log).toHaveBeenCalled();
      expect(message).toMatchSnapshot();
    });
  });
});