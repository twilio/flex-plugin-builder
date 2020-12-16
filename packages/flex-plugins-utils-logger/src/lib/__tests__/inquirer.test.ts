import inquirer from 'inquirer';

import * as inquirerScripts from '../inquirer';

jest.mock('inquirer');

describe('inquirer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('confirm', () => {
    it('should return true without default', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: 'yes' });
      const answer = await inquirerScripts.confirm('');
      expect(answer).toBeTruthy();
    });

    it('should return true with default and no answer', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: '' });
      const answer = await inquirerScripts.confirm('', 'Y');
      expect(answer).toBeTruthy();
    });

    it('should return false without default', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: 'no' });
      const answer = await inquirerScripts.confirm('');
      expect(answer).toBeFalsy();
    });

    it('should return false with default and no answer', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: '' });
      const answer = await inquirerScripts.confirm('', 'N');
      expect(answer).toBeFalsy();
    });
  });

  describe('choose', () => {
    it('should prompt question', async () => {
      const myQuestion = {
        name: 'the-question',
        message: 'the-message',
      };
      const choices = ['option1', 'option2'];
      const askedQuestion = Object.assign(myQuestion, { type: 'list' }, { choices });

      jest.spyOn(inquirerScripts, 'prompt').mockResolvedValue('the-choice');
      const answer = await inquirerScripts.choose(myQuestion, choices);

      expect(answer).toEqual('the-choice');
      expect(inquirerScripts.prompt).toHaveBeenCalledTimes(1);
      expect(inquirerScripts.prompt).toHaveBeenCalledWith(askedQuestion);
    });
  });

  describe('_validateConfirmation', () => {
    it('should return error message if no default and no answer provided', async () => {
      expect(await inquirerScripts._validateConfirmation()('')).toEqual(expect.any(String));
    });

    it('should return error message if incorrect answer is provided', async () => {
      expect(await inquirerScripts._validateConfirmation()('blah')).toEqual(expect.any(String));
    });

    it('should validate truthy if answer is correct', async () => {
      expect(await inquirerScripts._validateConfirmation()('yes')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('YeS')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('y')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('Y')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('no')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('No')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('N')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation()('n')).toBeTruthy();
    });

    it('should be truthy if no answer is provided, but default is provided', async () => {
      expect(await inquirerScripts._validateConfirmation('Y')('')).toBeTruthy();
      expect(await inquirerScripts._validateConfirmation('N')('')).toBeTruthy();
    });
  });
});
