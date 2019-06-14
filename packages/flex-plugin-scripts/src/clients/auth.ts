import inquirer, { Question } from 'inquirer';

export interface AuthConfig {
  accountSid: string;
  authToken: string;
}

/**
 * If the credentials are already not defined, then prompts the user to input them
 */
export const getCredentials = async (): Promise<AuthConfig> => {
  const usernameQuestion: Question = {
    type: 'input',
    name: 'username',
    message: 'Account Sid: ',
    validate: async (input: string) => {
      return typeof input === 'string' && input.length > 0;
    },
  };
  const passwordQuestion: Question = {
    type: 'password',
    name: 'password',
    message: 'Auth Token: ',
    validate: async (input: string) => {
      return typeof input === 'string' && input.length > 0;
    },
  };

  if (!process.env.ACCOUNT_SID) {
    const input = await inquirer.prompt([usernameQuestion]);
    process.env.ACCOUNT_SID = input.username;
  }

  if (!process.env.AUTH_TOKEN) {
    const input = await inquirer.prompt([passwordQuestion]);
    process.env.AUTH_TOKEN = input.password;
  }

  return {
    accountSid: process.env.ACCOUNT_SID as string,
    authToken: process.env.AUTH_TOKEN as string,
  };
};
