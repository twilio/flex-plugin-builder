"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var archivedSuccessfully = function (logger) { return function (name) {
    logger.info("++**" + name + "** was successfully archived.++");
}; };
var archivedFailed = function (logger) { return function (name) {
    logger.info("--Could not archive **" + name + "**; please try again later.--");
}; };
var alreadyArchived = function (logger) { return function (name, message) {
    logger.info("!!Cannot archive " + name + " because " + message.toLowerCase() + "!!");
}; };
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (function (logger) { return ({
    archivedSuccessfully: archivedSuccessfully(logger),
    archivedFailed: archivedFailed(logger),
    alreadyArchived: alreadyArchived(logger),
}); });
//# sourceMappingURL=archiveResource.js.map