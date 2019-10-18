import cli from '../cli';
import createFlexPlugin from '../create-flex-plugin';

jest.mock('../create-flex-plugin');

describe('cli', () => {
  it('should call createFlexPlugin', () => {
    new cli().parse();

    expect(createFlexPlugin).toHaveBeenCalledTimes(1);
  });

  it('should have static description', () => {
    expect(cli).toHaveProperty('description');
    expect(cli.description).toContain('new Twilio Flex Plugin');
  });

  it('should have static flag', () => {
    expect(cli).toHaveProperty('flags');
    expect(cli.flags).toHaveProperty('typescript');
  });

  it('should have accountSid as optional', () => {
    expect(cli).toHaveProperty('flags');
    expect(cli.flags).toHaveProperty('accountSid');
    expect(cli.flags.accountSid).not.toHaveProperty('demandOption');
  });
});
