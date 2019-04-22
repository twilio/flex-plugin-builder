import * as execa from 'execa';
import * as inquirer from 'inquirer';
import { error } from '../../src/utils/logging';
import * as validators from '../../src/utils/validators';
import Mock = jest.Mock;

jest.mock('execa');
jest.mock('../../src/utils/logging');

describe('validators', () => {
    beforeEach(() => jest.clearAllMocks());

    const mockPrompt = (mock: Mock) => {
        Object.defineProperty(inquirer, 'prompt', {
            value: mock,
        });
    };

    describe('_isValidPluginName', () => {
        it('should be valid plugin names', () => {
            const names = [
                'plugin-foo',
                'plugin-foo-bar',
                'plugin-2',
                'plugin-foo_bar',
            ];

            names.map(validators._isValidPluginName)
                .forEach((resp) => expect(resp).toBeTruthy());
        });

        it('should be an invalid plugin names', () => {
            const names = [
                'plugin',
                'plugin-',
                'name',
                'name-plugin',
            ];

            names.map(validators._isValidPluginName)
                .forEach((resp) => expect(resp).toBeFalsy());
        });
    });

    describe('_promptForAccountSid', () => {
        it(`should ask for an accountSid if not specified`, async () => {
            const prompt = jest.fn(() => Promise.resolve({
                accountSid: 'test-sid',
            }));
            mockPrompt(prompt);

            await validators._promptForAccountSid();
            expect(inquirer.prompt).toHaveBeenCalledTimes(1);
        });
    });

    describe('validate', () => {
        it('should error out if plugin name is not valid', async () => {
            const spyExit = jest.spyOn(process, 'exit')
                .mockImplementation(() => { throw new Error('asd'); });

            try {
                await validators.default({} as any);
            } catch (e) {
                expect(spyExit).toHaveBeenCalledWith(1);
                expect(error).toHaveBeenCalledWith('Invalid plugin name. Names need to start with plugin-');
            }
        });

        it(`should not ask for an accountSid if already specified`, async () => {
            const prompt = jest.fn();
            mockPrompt(prompt);

            // Act
            await validators.default({
                name: 'plugin-test',
                accountSid: 'fake-sid',
            } as any);

            // Assert
            expect(inquirer.prompt).not.toHaveBeenCalled();
        });
    });
});
