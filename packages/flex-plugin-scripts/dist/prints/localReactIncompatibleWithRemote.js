"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
exports.default = (function (localVersion, remoteVersion) {
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.warning(flex_dev_utils_1.singleLineString("The React version " + localVersion + " installed locally", "is incompatible with the React version " + remoteVersion + " installed on your Flex project."));
    flex_dev_utils_1.logger.info(flex_dev_utils_1.singleLineString('Change your local React version or visit https://flex.twilio.com/admin/developers to', "change the React version installed on your Flex project."));
});
//# sourceMappingURL=localReactIncompatibleWithRemote.js.map