import { sep, resolve } from 'path';

import { logger } from '@twilio/flex-dev-utils';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

import { ValidateReport, Warning } from '../clients/governor';

// eslint-disable-next-line sonarjs/cognitive-complexity
const printWarnings = (issues: Warning[]): void => {
  for (const issue of issues) {
    const filePaths = issue.file.split(sep).slice(2);
    const file = resolve(getPaths().cwd, ...filePaths);

    for (const warning of issue.warnings) {
      const {
        location: { line, column } = {},
        warningMessage,
        recommendation: { code = '', message = '', link },
      } = warning;

      if (line !== undefined && column !== undefined) {
        logger.newline();
        logger.info(logger.coloredStrings.link(logger.coloredStrings.underline(`${file}:${line}:${column + 1}`)));
      }

      logger.newline();
      logger.info(`${logger.coloredStrings.warning('Warning:')} ${warningMessage}`);

      if (message) {
        logger.newline();
        logger.info(`${logger.coloredStrings.success('Recommendation:')} ${message}`);
        if (code) {
          logger.newline();
          logger.info(logger.coloredStrings.code(code));
        }
        if (link) {
          logger.newline();
          logger.info(`More details ${logger.coloredStrings.bold(logger.linkText('here', link))}`);
        }
      }
    }
  }
};

export default (report: ValidateReport): void => {
  const noDeprecatedWarnings = report.api_compatibility.reduce((acc: number, warning) => {
    acc += warning.warnings.length;
    return acc;
  }, 0);

  const noDependencyWarnings = report.version_compatibility[0]?.warnings.length || 0;

  if (noDeprecatedWarnings > 0 || noDependencyWarnings > 0) {
    if (noDeprecatedWarnings > 0) {
      printWarnings(report.api_compatibility);
    }

    if (noDependencyWarnings > 0) {
      logger.newline();
      logger.info(logger.coloredStrings.link(logger.coloredStrings.underline(getPaths().app.pkgPath)));
      printWarnings(report.version_compatibility);
      logger.newline();
    }

    logger.warning(
      logger.coloredStrings.bold(
        logger.coloredStrings.error(
          `✖ Validation complete. Found ${noDeprecatedWarnings + noDependencyWarnings} issues`,
        ),
      ),
    );

    logger.info(
      logger.coloredStrings.dim(
        `${logger.coloredStrings.bold('Note:')} Validation does not check for compilation or syntax errors`,
      ),
    );
    logger.newline();
  } else {
    logger.success(`Validation complete. Found ${logger.coloredStrings.digit(0)} problems 🎉`);
  }
};
