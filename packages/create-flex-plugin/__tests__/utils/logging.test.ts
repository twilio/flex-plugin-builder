import * as log from '../../src/utils/logging';
import * as symbols from 'log-symbols';
import chalk from 'chalk';

describe('logging', () => {
	beforeEach(() => jest.clearAllMocks());

	(global as any).console = {
		log: jest.fn(),
		error: jest.fn(),
	};

	describe('error', () => {
		const SYMBOL_ERROR = symbols.error;
		const ERROR = chalk.bold('ERROR');

		it(`should return a 'console.error' message`, () => {
			// Arrange
			const errorMessage = 'Error message';
			const expectedMessage = `${SYMBOL_ERROR} ${ERROR} ${errorMessage}`;

			// Act
			log.error(errorMessage);

			// Assert
			expect(console.error).toHaveBeenCalledWith(expectedMessage);
		});

		it(`should accept any number of arguments`, () => {
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
		it(`should render an 'npm' setup message to the console`, () => {
			// Arrange
			let message;
			console.log = jest.fn((msg) => message = msg);

			// Act
			log.finalMessage({} as any);

			// Assert
			expect(console.log).toHaveBeenCalled();
			expect(message).toMatchSnapshot();
		});

		it(`should render a 'yarn' setup message to the console`, () => {
			// Arrange
			let message;
			console.log = jest.fn((msg) => message = msg);

			// Act
			log.finalMessage({yarn: true} as any);

			// Assert
			expect(console.log).toHaveBeenCalled();
			expect(message).toMatchSnapshot();
		});

		it(`should render an instruction message skipping the setup step`, () => {
			// Arrange
			let message;
			console.log = jest.fn((msg) => message = msg);

			// Act
			log.finalMessage({install: true} as any);

			// Assert
			expect(console.log).toHaveBeenCalled();
			expect(message).toMatchSnapshot();
		});
	});
});
