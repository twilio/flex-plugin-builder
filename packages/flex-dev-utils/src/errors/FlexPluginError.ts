import { PackageJson, readPackageJson } from '../fs';
import logger from '../logger';

export default class FlexPluginError extends Error {
  private readonly pkg: PackageJson | null;

  constructor(msg?: string) {
    super(msg);

    try {
      this.pkg = readPackageJson();
    } catch (e) {
      this.pkg = null;
    }

    Object.setPrototypeOf(this, FlexPluginError.prototype);
  }

  public print = () => {
    logger.error(this.message);
  }

  public details = () => {
    const headline = logger.coloredStrings.headline;
    if (this.pkg) {
      const deps = this.pkg.dependencies;
      const names = [
        'flex-plugin',
        'flex-plugin-scripts',
      ];

      logger.newline();
      logger.info(`Your plugin ${this.pkg.name} is using the following versions:`);
      logger.newline();
      names.forEach((name) => logger.info(`\t ${headline(`"${name}": "${deps[name]}"`)}`));
      logger.newline();
    }
  }
}
