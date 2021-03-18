import { progress } from 'flex-dev-utils';
import { flags } from '@oclif/command';
import { RequiredFlagError } from '@oclif/parser/lib/errors';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';

/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
export default class FlexPluginsRelease extends CreateConfiguration {
  static topicName = 'flex:plugins:release';

  static description = createDescription(FlexPluginsRelease.topic.description, false);

  public static flags = {
    ...CreateConfiguration.flags,
    'configuration-sid': flags.string({
      description: FlexPluginsRelease.topic.flags.configurationSid,
      exclusive: ['description', 'name', 'new'],
    }),
    name: flags.string({
      ...CreateConfiguration.nameFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    plugin: flags.string({
      ...CreateConfiguration.aliasEnablePluginFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    'enable-plugin': flags.string({
      ...CreateConfiguration.enablePluginFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    'disable-plugin': flags.string({
      ...CreateConfiguration.disablePluginFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    description: flags.string({
      ...CreateConfiguration.descriptionFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
  };

  // @ts-ignore
  private prints;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
    this.prints = this._prints.release;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    if (this._flags['configuration-sid']) {
      await this.doCreateRelease(this._flags['configuration-sid']);
    } else {
      const config = await super.doCreateConfiguration();
      await this.doCreateRelease(config.sid);
    }
  }

  async doCreateRelease(configurationSid: string): Promise<void> {
    await progress(
      `Enabling configuration **${configurationSid}**`,
      async () => this.createRelease(configurationSid),
      false,
    );

    this.prints.releaseSuccessful(configurationSid);
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  async createRelease(configurationSid: string) {
    return this.pluginsApiToolkit.release({ configurationSid });
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags(): OutputFlags<typeof FlexPluginsRelease.flags> {
    const parse = this.parse(FlexPluginsRelease);
    if (parse.flags['configuration-sid']) {
      return parse.flags;
    }

    ['description', 'name'].forEach((key) => {
      if (!parse.flags[key]) {
        throw new RequiredFlagError({
          flag: FlexPluginsRelease.flags[key],
          parse: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            input: {} as any,
            output: parse,
          },
        });
      }
    });

    const hasChange = ['enable-plugin', 'disable-plugin'].some((x) => parse.flags[x]);
    if (!hasChange) {
      throw new RequiredFlagError({
        flag: FlexPluginsRelease.flags['enable-plugin'],
        parse: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          input: {} as any,
          output: parse,
        },
      });
    }

    return parse.flags;
  }
}
