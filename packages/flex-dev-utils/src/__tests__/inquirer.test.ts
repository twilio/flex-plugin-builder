import * as Inquirer from '../inquirer';
import inquirer from 'inquirer';

jest.mock('inquirer');

describe('inquirer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('inputNotEmpty', () => {
    it('should return false', async () => {
      expect(await Inquirer.inputNotEmpty('')).toBeFalsy();
    });

    it('should return true', async () => {
      expect(await Inquirer.inputNotEmpty('1')).toBeTruthy();
    });
  });

  describe('accountSidValid', () => {
    it('should return false', async () => {
      expect(await Inquirer.accountSidValid('')).toBeFalsy();
      expect(await Inquirer.accountSidValid('AC0000000000000000000000000000000'))
        .toEqual(expect.any(String));
      expect(await Inquirer.accountSidValid('AB00000000000000000000000000000000'))
        .toEqual(expect.any(String));
    });

    it('should return true', async () => {
      expect(await Inquirer.accountSidValid('AC00000000000000000000000000000000')).toBeTruthy();
    });
  });

  describe('validateConfirmation', () => {
    it('should valid false if no default and no answer provided', async () => {
      expect(await Inquirer.validateConfirmation()('')).toEqual(expect.any(String));
    });

    it('should valid false if incorrect answer is provided', async () => {
      expect(await Inquirer.validateConfirmation()('blah')).toEqual(expect.any(String));
    });

    it('should valid truthy if answer is correct', async () => {
      expect(await Inquirer.validateConfirmation()('yes')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('YeS')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('y')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('Y')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('no')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('No')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('N')).toBeTruthy();
      expect(await Inquirer.validateConfirmation()('n')).toBeTruthy();
    });

    it('should be truthy if no answer is provided, but default is provided', async () => {
      expect(await Inquirer.validateConfirmation('Y')('')).toBeTruthy();
      expect(await Inquirer.validateConfirmation('N')('')).toBeTruthy();
    });
  });

  describe('confirm', () => {
    it('should return true without default', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: 'yes' });
      const answer = await Inquirer.confirm('');
      expect(answer).toBeTruthy();
    });

    it('should return true with default and no answer', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: '' });
      const answer = await Inquirer.confirm('', 'Y');
      expect(answer).toBeTruthy();
    });

    it('should return false without default', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: 'no' });
      const answer = await Inquirer.confirm('');
      expect(answer).toBeFalsy();
    });

    it('should return false with default and no answer', async () => {
      jest.spyOn(inquirer, 'prompt').mockResolvedValue({ answer: '' });
      const answer = await Inquirer.confirm('', 'N');
      expect(answer).toBeFalsy();
    });
  });
});
