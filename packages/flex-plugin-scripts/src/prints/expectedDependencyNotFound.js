"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var instructionToReinstall_1 = __importDefault(require("./instructionToReinstall"));
/**
 * An expected dependency from flex-ui package.json is missing.
 *
 * @param packageName the package name
 */
exports.default = (function (packageName) {
    var nameColor = flex_dev_utils_1.logger.coloredStrings.name;
    var flexUIName = nameColor('@twilio/flex-ui');
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.error('An expected package was not found.');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("Expected package " + nameColor(packageName) + " was not found in " + flexUIName + ".");
    flex_dev_utils_1.logger.newline();
    instructionToReinstall_1.default();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=expectedDependencyNotFound.js.map