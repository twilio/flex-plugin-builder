"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var instructionToReinstall_1 = __importDefault(require("./instructionToReinstall"));
exports.default = (function (foundPackages, notFoundPackages) {
    var headline = flex_dev_utils_1.logger.coloredStrings.headline;
    flex_dev_utils_1.logger.info('Your plugin has the following packages installed:');
    flex_dev_utils_1.logger.newline();
    foundPackages.forEach(function (detail) {
        flex_dev_utils_1.logger.info("\t " + headline("\"" + detail.name + "\": \"" + detail.package.version + "\""));
    });
    if (notFoundPackages.length) {
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.error('However, some required packages were not found:');
        flex_dev_utils_1.logger.newline();
        notFoundPackages.forEach(function (detail) {
            flex_dev_utils_1.logger.info("\t " + headline("\"" + detail.name + "\""));
        });
        flex_dev_utils_1.logger.newline();
        instructionToReinstall_1.default();
    }
});
//# sourceMappingURL=packagesVersions.js.map