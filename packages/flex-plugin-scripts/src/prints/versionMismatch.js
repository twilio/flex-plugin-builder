"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
var instructionToReinstall_1 = __importDefault(require("./instructionToReinstall"));
var preFlightByPass_1 = __importDefault(require("./preFlightByPass"));
/**
 * Logs a warning that a package version mismatches what Flex-UI requires
 *
 * @param packageName       the package that has the mismatch
 * @param installedVersion  the installed version
 * @param requiredVersion   the required version
 * @param skip              whether the developer is opting to skip
 */
exports.default = (function (packageName, installedVersion, requiredVersion, skip) {
    var nameColor = flex_dev_utils_1.logger.coloredStrings.name;
    var headline = flex_dev_utils_1.logger.coloredStrings.headline;
    var red = flex_dev_utils_1.logger.colors.red;
    var flexUIName = nameColor('@twilio/flex-ui');
    var scriptName = nameColor('flex-plugin-scripts');
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.error(strings_1.singleLineString('There might be a problem with your project dependency tree.'));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("The " + flexUIName + " requires the following package:");
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("\t " + headline("\"" + packageName + "\": \"" + requiredVersion + "\""));
    flex_dev_utils_1.logger.newline();
    var versionPrint = red(installedVersion);
    flex_dev_utils_1.logger.info("However, a different version of this package was detected: " + versionPrint + ".");
    flex_dev_utils_1.logger.info("Do not try to install this manually; " + scriptName + " manages that for you.");
    flex_dev_utils_1.logger.info('Managing this package yourself is known to cause issues in production environments.');
    flex_dev_utils_1.logger.newline();
    instructionToReinstall_1.default("Remove " + nameColor(packageName) + " from your " + nameColor('package.json') + " file");
    preFlightByPass_1.default(skip);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=versionMismatch.js.map