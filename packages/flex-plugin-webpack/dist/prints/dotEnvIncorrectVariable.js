"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
exports.default = (function (filename, key) {
    flex_dev_utils_1.env.persistTerminal();
    var isQuiet = flex_dev_utils_1.env.isQuiet();
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.warning("Unsupported variable **" + key + "** provided in **" + filename + "** file. Variables must start with either FLEX_APP_ or REACT_APP_.");
    flex_dev_utils_1.env.setQuiet(isQuiet);
});
//# sourceMappingURL=dotEnvIncorrectVariable.js.map