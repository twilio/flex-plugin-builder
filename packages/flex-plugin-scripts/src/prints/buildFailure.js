"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_1 = require("flex-dev-utils/dist/fs");
var GITHUB_FEATURE_REQUEST = 'https://bit.ly/2UMdbbj';
/**
 * Logs the error line ; tries to parse and print useful information based on the error
 * @param error the error line
 */
var logError = function (error) {
    flex_dev_utils_1.logger.info(error);
    if (error.indexOf('You may need an appropriate loader') !== -1) {
        var link = flex_dev_utils_1.logger.coloredStrings.link(GITHUB_FEATURE_REQUEST);
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.notice("You may file a feature request on GitHub (" + link + ") so we can add this loader.");
    }
};
/**
 * Prints the errors when a build has failed to compile
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.default = (function (errors) {
    errors = errors || [];
    if (!errors.length) {
        errors = [errors];
    }
    flex_dev_utils_1.env.setQuiet(false);
    var pkgName = flex_dev_utils_1.logger.colors.red.bold(fs_1.getPaths().app.name);
    if (flex_dev_utils_1.env.isCLI()) {
        flex_dev_utils_1.logger.newline(2);
    }
    flex_dev_utils_1.logger.error("Failed to compile plugin " + pkgName + ".");
    flex_dev_utils_1.logger.newline();
    errors.forEach(function (error, index) {
        var title = flex_dev_utils_1.logger.colors.bold("Error " + (index + 1));
        flex_dev_utils_1.logger.info(title + ":");
        if (typeof error === 'string') {
            logError(error);
        }
        if (typeof error === 'object') {
            logError(error.message);
        }
        flex_dev_utils_1.logger.newline();
    });
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=buildFailure.js.map