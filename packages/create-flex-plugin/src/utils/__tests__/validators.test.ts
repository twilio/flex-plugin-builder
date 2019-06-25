import execa from 'execa';
import * as inquirer from 'flex-dev-utils/dist/inquirer';
import { logger } from 'flex-dev-utils';

import * as validators from '../validators';

jest.mock('execa');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/inquirer');

describe('validators', () => {
    const accountSid = 'AC00000000000000000000000000000000';

    beforeEach(() => jest.resetAllMocks());

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
        it('should ask for an accountSid if not specified', async () => {
            (inquirer as any).prompt = jest.fn(() => Promise.resolve({
                accountSid: 'test-sid',
            }));

            await validators._promptForAccountSid();
            expect(inquirer.prompt).toHaveBeenCalledTimes(1);
        });
    });

    describe('_promptForTemplateUrl', () => {
        it('should ask for a url if url is invalid', async () => {
            (inquirer as any).prompt = jest.fn(() => Promise.resolve({
                url: 'twilio',
            }));

            await validators._promptForTemplateUrl();
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
                expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid'));
                expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('start with plugin-'));
            }
        });

        it('should not ask for an accountSid if already specified', async () => {
            (inquirer as any).prompt = jest.fn();

            // Act
            await validators.default({
                name: 'plugin-test',
                accountSid,
            } as any);

            // Assert
            expect(inquirer.prompt).not.toHaveBeenCalled();
        });

        it('should not ask for a template url if already specified', async () => {
            (inquirer as any).prompt = jest.fn();

            // Act
            await validators.default({
                name: 'plugin-test',
                accountSid,
                template: 'github.com/twilio/flex-plugin',
            } as any);

            // Assert
            expect(inquirer.prompt).not.toHaveBeenCalled();
        });
    });

    describe('_isValidUrl', () => {
        it('should be valid URL', () => {
            const data = [
                'https://wwww.twilio.com',
                'www.twilio.com',
                'twilio.com',
                'https://www.twilio.com/foo/bar/baz',
                'www.twilio.com/foo/bar/baz',
                'twilio.com/foo/bar/baz',
                'https://www.twilio.com/foo/bar/baz?query=true&another=true',
                'www.twilio.com/foo/bar/baz?query=true&another=true',
                'twilio.com/foo/bar/baz?query=true&another=true',
            ];

            data.map(validators._isValidUrl)
                .forEach((resp) => expect(resp).toBeTruthy());
        });

        it('should be invalid URL', () => {
            const data = [
                'htt://wwww.twilio.com',
                'http:/wwww.twilio.com',
                'twilio. com',
                'twilio',
            ];

            data.map(validators._isValidUrl)
                .forEach((resp) => expect(resp).toBeFalsy());
        });
    });
});
