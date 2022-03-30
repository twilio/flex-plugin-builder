import { Logger } from '@twilio/flex-dev-utils';

const archivedSuccessfully =
  (logger: Logger) =>
  (name: string): void => {
    logger.info(`++**${name}** was successfully archived.++`);
  };

const archivedFailed =
  (logger: Logger) =>
  (name: string): void => {
    logger.info(`--Could not archive **${name}**; please try again later.--`);
  };

const alreadyArchived =
  (logger: Logger) =>
  (name: string, message: string): void => {
    logger.info(`!!Cannot archive ${name} because ${message.toLowerCase()}!!`);
  };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => ({
  archivedSuccessfully: archivedSuccessfully(logger),
  archivedFailed: archivedFailed(logger),
  alreadyArchived: alreadyArchived(logger),
});
