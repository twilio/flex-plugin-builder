import { PackageJson, readPackageJson } from '../fs';
import logger from '../logger';

export default class FlexPluginError extends Error {
  private readonly pkg: PackageJson;

  constructor(msg?: string) {
    super(msg);

    this.pkg = readPackageJson();

    Object.setPrototypeOf(this, FlexPluginError.prototype);
  }

  public print = () => {
    logger.error(this.message);
  }

  public details = () => {
    const headline = logger.coloredStrings.headline;
    const deps = this.pkg.dependencies;
    const names = [
      'craco-config-flex-plugin',
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
