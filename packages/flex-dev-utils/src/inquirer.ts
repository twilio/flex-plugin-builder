import inquirer, { Question } from 'inquirer';

export default inquirer;
export type Question = Question;

/**
 * Prompts the user to answer the question. Upon validation, returns the result.
 *
 * @param question  the question
 */
export const prompt = async <R>(question: Question): Promise<R> => {
  return await inquirer.prompt<R>(question);
};
