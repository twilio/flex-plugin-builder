import CLI from '../cli';
import { createFlexPlugin } from '../create-flex-plugin';

jest.mock('../create-flex-plugin');
jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('CLI', () => {
  const exit = jest.spyOn(process, 'exit').mockReturnThis();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should have static description', () => {
    expect(CLI).toHaveProperty('description');
    expect(CLI.description).toContain('new Twilio Flex Plugin');
  });

  it('should have static flag', () => {
    expect(CLI).toHaveProperty('flags');
    expect(CLI.flags).toHaveProperty('typescript');
  });

  it('should have accountSid as optional', () => {
    expect(CLI).toHaveProperty('flags');
    expect(CLI.flags).toHaveProperty('accountSid');
    expect(CLI.flags.accountSid).not.toHaveProperty('demandOption');
  });
});
