"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
exports.default = (function (payload) {
    flex_dev_utils_1.logger.error('Flex Plugin Builder server has crashed:', payload.exception.message);
    flex_dev_utils_1.logger.info(payload.exception.stack);
});
//# sourceMappingURL=serverCrashed.js.map