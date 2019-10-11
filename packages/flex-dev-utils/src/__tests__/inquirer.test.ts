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

  describe('choose', () => {
    it('should prompt question', async () => {
      const myQuestion = {
        name: 'the-question',
        message: 'the-message',
      };
      const choices = ['option1', 'option2'];
      const askedQuestion = Object.assign(myQuestion, {type: 'list'}, {choices});

      jest.spyOn(Inquirer, 'prompt').mockResolvedValue('the-choice');
      const answer = await Inquirer.choose(myQuestion, choices);

      expect(answer).toEqual('the-choice');
      expect(Inquirer.prompt).toHaveBeenCalledTimes(1);
      expect(Inquirer.prompt).toHaveBeenCalledWith(askedQuestion);
    });
  });
});
