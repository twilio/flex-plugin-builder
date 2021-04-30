"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
/**
 * Prints a warning message about the availability of Plugins API
 */
exports.default = (function () {
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.boxen.warning('Plugins API is currently offered as a Pilot; it is very likely to change before the product reaches general availability.');
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=pluginsApiWarning.js.map