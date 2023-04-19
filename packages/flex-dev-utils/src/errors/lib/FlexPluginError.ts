import { TwilioError } from '@twilio/flex-plugins-utils-exception';

import { AppPackageJson, readAppPackageJson } from '../../fs';
import { logger } from '../../logger';

export default class FlexPluginError extends TwilioError {
  private readonly pkg: AppPackageJson | null;

  constructor(msg?: string) {
    /* c8 ignore next */
    super(msg);

    try {
      this.pkg = readAppPackageJson();
    } catch (e) {
      this.pkg = null;
    }

    Object.setPrototypeOf(this, FlexPluginError.prototype);
  }

  public print = (): void => {
    logger.error(this.message);
  };

  public details = (): void => {
    const { headline } = logger.coloredStrings;
    if (this.pkg) {
      const deps = this.pkg.dependencies;
      const names = ['@twilio/flex-plugin', '@twilio/flex-plugin-scripts'];

      logger.newline();
      logger.info(`Your plugin ${this.pkg.name} is using the following versions:`);
      logger.newline();
      names.forEach((name) => logger.info(`\t ${headline(`"${name}": "${deps[name]}"`)}`));
      logger.newline();
    }
  };
}
