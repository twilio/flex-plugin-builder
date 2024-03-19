import { baseCommands } from '@twilio/cli-core';
import { Config, ConfigData } from '@twilio/cli-core/src/services/config';
import * as createFlexPlugin from '@twilio/create-flex-plugin/dist/lib/cli';

import FlexPluginsCreate from '../../../../commands/flex/plugins/create';
import { constants, getTmpDirectory } from '../../../framework';

const mockUserConfig = async <C extends FlexPluginsCreate>(command: C): Promise<C> => {
  // @ts-ignore
  command.userConfig = new ConfigData();
  // @ts-ignore
  command.userConfig.addProfile(
    'default',
    constants.FAKE_ACCOUNT_SID,
    '',
    constants.FAKE_API_KEY,
    constants.FAKE_API_SECRET,
  );
  // @ts-ignore
  command.userConfig.setActiveProfile('default');

  return command;
};

const mockConfig = async <C extends FlexPluginsCreate>(command: C): Promise<C> => {
  const tmpDir = getTmpDirectory();

  // @ts-ignore
  if (!command.config) {
    // @ts-ignore
    command.config = await OClifConfig.load();
  }
  // @ts-ignore
  command.config.configDir = tmpDir.name;

  // @ts-ignore
  const tempConfig = new Config(tmpDir.name);
  // @ts-ignore
  await tempConfig.save(command.userConfig);

  return command;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTest =
  <C extends FlexPluginsCreate>(Command: new (...argv: any[]) => C) =>
  async (...args: string[]): Promise<C> => {
    return Promise.resolve(new Command(args, ConfigData))
      .then(async (c) => mockUserConfig(c))
      .then(async (c) => mockConfig(c));
  };

describe('Commands/FlexPluginsCreate', () => {
  it('should have own flags', () => {
    expect(FlexPluginsCreate.flags).not.toBeSameObject(baseCommands.TwilioClientCommand.flags);
  });
  it('should run the command', async () => {
    const cmd = await createTest(FlexPluginsCreate)('plugin-sample-one');
    // @ts-ignore
    const spy = jest.spyOn(createFlexPlugin, 'default').mockReturnValue({
      parse: jest.fn().mockResolvedValue(true),
    });

    await cmd.run();
    expect(spy).toHaveBeenCalled();
  });
});
