"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
exports.default = (function (filename, key) {
    flex_dev_utils_1.env.persistTerminal();
    flex_dev_utils_1.logger.warning("Unsupported variable **" + key + "** provided in **" + filename + "** file. Variables must start with either FLEX_APP_ or REACT_APP_.");
});
//# sourceMappingURL=dotEnvIncorrectVariable.js.map