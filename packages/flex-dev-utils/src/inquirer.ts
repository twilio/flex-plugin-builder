import inquirer, { Question as IQuestion } from 'inquirer';

export default inquirer;

export interface Question {
  name: string;
  message: string;
  type?: 'list' | 'input' | 'password';
  validate?(input: string): Promise<boolean | string>;
}

/**
 * Simple input validator to verify it is not empty
 * @param input
 */
export const inputNotEmpty = async (input: string) => input && input.length > 0;

/**
 * Prompts the user to answer the question. Upon validation, returns the answer.
 *
 * @param question  the question to prompt the user with
 */
export const prompt = async <T extends Question>(question: Question): Promise<T['name']> => {
  question.type = question.type || 'input';

  const result = await inquirer.prompt(question as IQuestion);
  const nameKey = Object.keys(question).find((k) => k === 'name') as string;

  return result[question[nameKey]];
};

/**
 * Prompts the user to select from one of the choices.
 *
 * @param question  the question to prompt the user with
 * @param choices   the list of options
 */
export const choose = async <T extends Question>(question: Question, choices: string[]): Promise<T['name']> => {
  question.type = 'list';

  return prompt<T>(Object.assign(question, {choices}));
};
