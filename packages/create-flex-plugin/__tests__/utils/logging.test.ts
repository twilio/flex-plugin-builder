import chalk from 'chalk';
import * as symbols from 'log-symbols';
import * as log from '../../src/utils/logging';

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
            const errorMessage = 'Error message';
            const expectedMessage = `${SYMBOL_ERROR} ${ERROR} ${errorMessage}`;

            log.error(errorMessage);

            // tslint:disable-next-line:no-console
            expect(console.error).toHaveBeenCalledWith(expectedMessage);
        });

        it(`should accept any number of arguments`, () => {
            const errorMessage = 'Error message';
            const arg1 = 'argument #1';
            const arg2 = 'argument #2';
            const args = [arg1, arg2];
            const expectedMessage = `${SYMBOL_ERROR} ${ERROR} ${errorMessage}`;

            log.error(errorMessage, ...args);

            // tslint:disable-next-line:no-console
            expect(console.error).toHaveBeenCalledWith(expectedMessage, ...args);
        });
    });

    describe('finalMessage', () => {
        it(`should render an 'npm' setup message to the console`, () => {
            let message = '';
            // tslint:disable-next-line:no-console
            console.log = jest.fn((msg) => message = msg);

            log.finalMessage({} as any);

            // tslint:disable-next-line:no-console
            expect(console.log).toHaveBeenCalled();
            expect(message).toMatchSnapshot();
        });

        it(`should render a 'yarn' setup message to the console`, () => {
            let message = '';
            // tslint:disable-next-line:no-console
            console.log = jest.fn((msg) => message = msg);

            log.finalMessage({yarn: true} as any);

            // tslint:disable-next-line:no-console
            expect(console.log).toHaveBeenCalled();
            expect(message).toMatchSnapshot();
        });

        it(`should render an instruction message skipping the setup step`, () => {
            let message = '';
            // tslint:disable-next-line:no-console
            console.log = jest.fn((msg) => message = msg);

            log.finalMessage({install: true} as any);

            // tslint:disable-next-line:no-console
            expect(console.log).toHaveBeenCalled();
            expect(message).toMatchSnapshot();
        });
    });
});
