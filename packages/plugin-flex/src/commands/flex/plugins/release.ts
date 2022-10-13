import { progress } from '@twilio/flex-dev-utils';
import { flags } from '@oclif/command';
import { RequiredFlagError } from '@oclif/parser/lib/errors';
import { OutputFlags, ParserOutput } from '@oclif/parser/lib/parse';
import { Release } from '@twilio/flex-plugins-api-client';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';

const descriptionFlex = 'description';
const nameFlex = 'name';
const enablePluginFlex = 'enable-plugin';
const disablePluginFlex = 'disable-plugin';
const newFlex = 'new';
const configurationSidFlex = 'configuration-sid';

/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
export default class FlexPluginsRelease extends CreateConfiguration {
  static topicName = 'flex:plugins:release';

  static description = createDescription(FlexPluginsRelease.topic.description, false);

  public static flags = {
    ...CreateConfiguration.flags,
    [configurationSidFlex]: flags.string({
      description: FlexPluginsRelease.topic.flags.configurationSid,
      exclusive: [descriptionFlex, nameFlex, newFlex],
    }),
    name: flags.string({
      ...CreateConfiguration.nameFlag,
      required: false,
      exclusive: [configurationSidFlex],
    }),
    plugin: flags.string({
      ...CreateConfiguration.aliasEnablePluginFlag,
      required: false,
      exclusive: [configurationSidFlex],
    }),
    [enablePluginFlex]: flags.string({
      ...CreateConfiguration.enablePluginFlag,
      required: false,
      exclusive: [configurationSidFlex],
    }),
    [disablePluginFlex]: flags.string({
      ...CreateConfiguration.disablePluginFlag,
      required: false,
      exclusive: [configurationSidFlex],
    }),
    description: flags.string({
      ...CreateConfiguration.descriptionFlag,
      required: false,
      exclusive: [configurationSidFlex],
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsRelease.flags>;

  // @ts-ignore
  private prints;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
    this.prints = this._prints.release;
  }

  async init(): Promise<void> {
    const parsed: ParserOutput<any, any> = await this.parseCommand(FlexPluginsRelease);
    if (parsed.flags[configurationSidFlex]) {
      this._flags = parsed.flags;
      return;
    }

    [descriptionFlex, nameFlex].forEach((key) => {
      if (!parsed.flags[key]) {
        throw new RequiredFlagError({
          flag: FlexPluginsRelease.flags[key],
          parse: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            input: {} as any,
            output: parsed,
          },
        });
      }
    });

    const hasChange = [enablePluginFlex, disablePluginFlex].some((x) => parsed.flags[x]);
    if (!hasChange) {
      throw new RequiredFlagError({
        flag: FlexPluginsRelease.flags[enablePluginFlex],
        parse: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          input: {} as any,
          output: parsed,
        },
      });
    }

    this._flags = parsed.flags;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    if (this._flags[configurationSidFlex]) {
      await this.doCreateRelease(this._flags[configurationSidFlex]);
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
  async createRelease(configurationSid: string): Promise<Release> {
    return this.pluginsApiToolkit.release({ configurationSid });
  }
}
