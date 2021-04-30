"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
/**
 * Prints an error if jest module is not installed
 */
exports.default = (function () {
    var bold = flex_dev_utils_1.logger.colors.bold('jest');
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.error("It looks like you're trying to use Jest but do not have the %s package installed.", bold);
    flex_dev_utils_1.logger.info('Please install %s by running:', bold);
    flex_dev_utils_1.logger.installInfo('npm', 'install jest --save-dev');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=jestNotInstalled.js.map