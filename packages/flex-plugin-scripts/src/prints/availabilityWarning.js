"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
/**
 * Prints a warning message about the availability of the release script
 */
exports.default = (function () {
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.boxen.warning('Release script is currently in pilot and is limited in availability');
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=availabilityWarning.js.map