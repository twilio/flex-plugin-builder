import { Logger } from 'flex-dev-utils';

export const archivedSuccessfully = (logger: Logger) => (name: string) => {
  logger.info(`**${name}** was successfully archived.`);
};

export const archivedFailed = (logger: Logger) => (name: string) => {
  logger.info(`--Could not archive **${name}**; please try again later.--`);
};

export const alreadyArchived = (logger: Logger) => (name: string) => {
  logger.info(`!!**${name}** is already archived.!!`);
};

export default (logger: Logger) => ({
  archivedSuccessfully: archivedSuccessfully(logger),
  archivedFailed: archivedFailed(logger),
  alreadyArchived: alreadyArchived(logger),
});
