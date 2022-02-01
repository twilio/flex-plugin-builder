/* eslint-disable @typescript-eslint/no-explicit-any */
import * as questions from '@twilio/flex-dev-utils/dist/questions';

import * as validators from '../validators';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/questions');

describe('validators', () => {
  const pluginName = 'plugin-test';
  const accountSid = 'AC00000000000000000000000000000000';
  const url = 'https://twilio.com';

  beforeEach(() => jest.resetAllMocks());

  describe('_promptForAccountSid', () => {
    it('should ask for an accountSid if not specified', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prompt = jest.spyOn(questions, 'prompt').mockResolvedValue('test-sid');

      await validators._promptForAccountSid();
      expect(prompt).toHaveBeenCalledTimes(1);
    });
  });

  describe('_promptForTemplateUrl', () => {
    it('should ask for a url if url is invalid', async () => {
      const prompt = jest.spyOn(questions, 'prompt').mockResolvedValue('twilio');

      await validators._promptForTemplateUrl();
      expect(prompt).toHaveBeenCalledTimes(1);
    });
  });

  describe('validate', () => {
    it('should not ask for an accountSid if already specified', async () => {
      const prompt = jest.spyOn(questions, 'prompt');

      await validators.default({
        name: pluginName,
        accountSid,
      } as any);

      expect(prompt).not.toHaveBeenCalled();
    });

    it('should not ask for an accountSid if no sid is provided', async () => {
      const prompt = jest.spyOn(questions, 'prompt');

      await validators.default({
        name: pluginName,
      } as any);

      expect(prompt).not.toHaveBeenCalled();
    });

    it('should ask for an accountSid if incorrect accountSid', async () => {
      const prompt = jest.spyOn(questions, 'prompt').mockResolvedValue(accountSid);

      const config = await validators.default({
        name: pluginName,
        accountSid: 'abcd',
      } as any);

      expect(prompt).toHaveBeenCalledTimes(1);
      expect(config.accountSid).toEqual(accountSid);
    });

    it('should not ask for a template url if already specified', async () => {
      const prompt = jest.spyOn(questions, 'prompt');

      await validators.default({
        name: pluginName,
        accountSid,
        template: 'github.com/twilio/flex-plugin',
      } as any);

      expect(prompt).not.toHaveBeenCalled();
    });

    it('should ask for template url if invalid url is provided', async () => {
      const prompt = jest.spyOn(questions, 'prompt').mockResolvedValue(url);

      const config = await validators.default({
        name: pluginName,
        accountSid,
        template: 'incorrect-url',
      } as any);

      expect(prompt).toHaveBeenCalledTimes(1);
      expect(config.template).toEqual(url);
    });
  });
});
