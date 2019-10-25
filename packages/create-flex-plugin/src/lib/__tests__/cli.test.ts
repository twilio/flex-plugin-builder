import * as run from 'flex-plugin-scripts/dist/utils/run';
import cli from '../cli';
import createFlexPlugin from '../create-flex-plugin';

jest.mock('../create-flex-plugin');

describe('cli', () => {
  const exit = jest.spyOn(process, 'exit').mockReturnThis();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should call createFlexPlugin', async () => {
    await new cli().parse();

    expect(createFlexPlugin).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
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
