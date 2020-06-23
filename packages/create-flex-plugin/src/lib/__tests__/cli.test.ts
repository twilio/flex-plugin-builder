import CLI from '../cli';
import createFlexPlugin from '../create-flex-plugin';

jest.mock('../create-flex-plugin');

describe('CreateFlexPlugin/cli', () => {
  const exit = jest.spyOn(process, 'exit').mockReturnThis();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should call createFlexPlugin with a JS template', async () => {
    await new CLI().parse('plugin-test');

    expect(createFlexPlugin).toHaveBeenCalledTimes(1);
    expect(createFlexPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'plugin-test',
        typescript: false,
        template: CLI.JSTemplate,
      })
    );
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('should call createFlexPlugin with a TS template', async () => {
    await new CLI().parse('plugin-test', '--typescript');

    expect(createFlexPlugin).toHaveBeenCalledTimes(1);
    expect(createFlexPlugin).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'plugin-test',
        typescript: true,
        template: CLI.TSTemplate,
      })
    );
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
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
