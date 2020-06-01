import { FlexPluginError } from 'flex-dev-utils';
import * as inquirer from 'flex-dev-utils/dist/inquirer';

import * as validators from '../validators';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/inquirer');

describe('validators', () => {
    const accountSid = 'AC00000000000000000000000000000000';
    const url = 'https://twilio.com';

    beforeEach(() => jest.resetAllMocks());

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
            try {
                await validators.default({} as any);
            } catch (e) {
                expect(e).toBeInstanceOf(FlexPluginError);
                expect(e.message).toContain('Invalid plugin name');
                expect(e.message).toContain('start with plugin-');
            }
        });

        it('should not ask for an accountSid if already specified', async () => {
            const prompt = jest.spyOn(inquirer, 'prompt');

            await validators.default({
                name: 'plugin-test',
                accountSid,
            } as any);

            expect(prompt).not.toHaveBeenCalled();
        });

        it('should not ask for an accountSid if no sid is provided', async () => {
            const prompt = jest.spyOn(inquirer, 'prompt');

            const config = await validators.default({
                name: 'plugin-test',
            } as any);

            expect(prompt).not.toHaveBeenCalled();
        });

        it('should ask for an accountSid if incorrect accountSid', async () => {
            const prompt = jest.spyOn(inquirer, 'prompt').mockResolvedValue(accountSid);

            const config = await validators.default({
                name: 'plugin-test',
                accountSid: 'abcd',
            } as any);

            expect(prompt).toHaveBeenCalledTimes(1);
            expect(config.accountSid).toEqual(accountSid);
        });

        it('should not ask for a template url if already specified', async () => {
            const prompt = jest.spyOn(inquirer, 'prompt');

            await validators.default({
                name: 'plugin-test',
                accountSid,
                template: 'github.com/twilio/flex-plugin',
            } as any);

            expect(prompt).not.toHaveBeenCalled();
        });

        it('should ask for template url if invalid url is provided', async () => {
            const prompt = jest.spyOn(inquirer, 'prompt').mockResolvedValue(url);

            const config = await validators.default({
                name: 'plugin-test',
                accountSid,
                template: 'incorrect-url',
            } as any);

            expect(prompt).toHaveBeenCalledTimes(1);
            expect(config.template).toEqual(url);
        });
    });
});
