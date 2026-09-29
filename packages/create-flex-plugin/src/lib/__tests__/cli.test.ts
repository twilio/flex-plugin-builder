import CLI, { FLEX_UI_1_EOL, assertFlexUiSupported } from '../cli';
import { createFlexPlugin } from '../create-flex-plugin';

jest.mock('../create-flex-plugin');
jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('CLI', () => {
  const exit = jest.spyOn(process, 'exit').mockReturnThis();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should call createFlexPlugin', async () => {
    await new CLI().parse();

    expect(createFlexPlugin).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('should still register --flexui1 so it fails with guidance', () => {
    expect(CLI.flags).toHaveProperty('flexui1');
    expect(FLEX_UI_1_EOL).toContain('end of life');
    expect(FLEX_UI_1_EOL).toContain('twilio flex:plugins:upgrade-plugin');
  });

  it('should reject --flexui1', () => {
    expect(() => assertFlexUiSupported({ flexui1: true })).toThrow(FLEX_UI_1_EOL);
  });

  it('should allow everything else', () => {
    expect(() => assertFlexUiSupported({})).not.toThrow();
    expect(() => assertFlexUiSupported({ flexui2: true })).not.toThrow();
    expect(() => assertFlexUiSupported(undefined)).not.toThrow();
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
