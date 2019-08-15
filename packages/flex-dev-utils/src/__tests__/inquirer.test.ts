import * as Inquirer from '../inquirer';
import inquirer from 'inquirer';

jest.mock('inquirer');

describe('inquirer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
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
