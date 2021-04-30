"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
/**
 * Prints the SKIP_PREFLIGHT_CHECK message
 *
 * @param skip  whether SKIP_PREFLIGHT_CHECK is already set
 */
exports.default = (function (skip) {
    flex_dev_utils_1.env.setQuiet(false);
    if (skip) {
        flex_dev_utils_1.logger.warning('SKIP_PREFLIGHT_CHECK=true is used and the warning is ignored; your script will continue.');
    }
    else {
        flex_dev_utils_1.logger.warning(strings_1.multilineString('If you like to skip this and proceed anyway, use SKIP_PREFLIGHT_CHECK=true environment variable.', 'This will disable checks and allow you to run your application.'));
    }
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=preFlightByPass.js.map