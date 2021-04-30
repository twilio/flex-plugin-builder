"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
var preFlightByPass_1 = __importDefault(require("./preFlightByPass"));
/**
 * Prints instruction about unpinned react
 *
 * @param flexUIVersion   the installed version of flex-ui
 * @param packageName     the package that has the mismatch
 * @param version         the installed version
 * @param skip            whether the developer is opting to skip
 */
exports.default = (function (flexUIVersion, packageName, version, skip) {
    var nameColor = flex_dev_utils_1.logger.coloredStrings.name;
    var headline = flex_dev_utils_1.logger.coloredStrings.headline;
    var flexUIName = nameColor('@twilio/flex-ui');
    var minFlexUIVersion = nameColor('1.19.0');
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.error('There might be a problem with your project dependency tree.');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info('You are attempting to use the following package:');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("\t " + headline("\"" + packageName + "\": \"" + version + "\""));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info(strings_1.singleLineString("However, unbundled React is only supported with " + flexUIName + " version higher than ", minFlexUIVersion + ". You are currently running:"));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("\t " + headline("\"@twilio/flex-ui\": \"" + flexUIVersion + "\""));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("To fix this issue, install " + flexUIName + " >= " + minFlexUIVersion);
    flex_dev_utils_1.logger.newline();
    preFlightByPass_1.default(skip);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=unbundledReactMismatch.js.map