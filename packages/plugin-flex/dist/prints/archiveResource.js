"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const archivedSuccessfully = (logger) => (name) => {
    logger.info(`++**${name}** was successfully archived.++`);
};
const archivedFailed = (logger) => (name) => {
    logger.info(`--Could not archive **${name}**; please try again later.--`);
};
const alreadyArchived = (logger) => (name, message) => {
    logger.info(`!!Cannot archive ${name} because ${message.toLowerCase()}!!`);
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (logger) => ({
    archivedSuccessfully: archivedSuccessfully(logger),
    archivedFailed: archivedFailed(logger),
    alreadyArchived: alreadyArchived(logger),
});
//# sourceMappingURL=archiveResource.js.map