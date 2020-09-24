import { progress } from 'flex-plugins-utils-logger';
import { flags } from '@oclif/command';
import { RequiredFlagError } from '@oclif/parser/lib/errors';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration, { nameFlag, pluginFlag, descriptionFlag } from '../../../sub-commands/create-configuration';
import { release as releaseDocs } from '../../../commandDocs.json';

/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
export default class FlexPluginsRelease extends CreateConfiguration {
  static description = createDescription(releaseDocs.description, false);

  public static flags = {
    ...CreateConfiguration.flags,
    'configuration-sid': flags.string({
      description: releaseDocs.flags.configurationSid,
      exclusive: ['description', 'name', 'new'],
    }),
    name: flags.string({
      ...nameFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    plugin: flags.string({
      ...pluginFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
    description: flags.string({
      ...descriptionFlag,
      required: false,
      exclusive: ['configuration-sid'],
    }),
  };

  private prints;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false, runInDirectory: false });

    this.scriptArgs = [];
    this.prints = this._prints.release;
  }

  /**
   * @override
   */
  async doRun() {
    if (this._flags['configuration-sid']) {
      await this.doCreateRelease(this._flags['configuration-sid']);
    } else {
      const config = await super.doCreateConfiguration();
      await this.doCreateRelease(config.sid);
    }
  }

  async doCreateRelease(configurationSid: string) {
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

  get _flags() {
    const parse = this.parse(FlexPluginsRelease);
    if (parse.flags['configuration-sid']) {
      return parse.flags;
    }

    ['plugin', 'description', 'name'].forEach((key) => {
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

    return parse.flags;
  }
}
