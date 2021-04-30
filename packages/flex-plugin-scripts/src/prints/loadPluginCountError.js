"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
exports.default = (function (count) {
    var bold = flex_dev_utils_1.logger.colors.bold;
    var link = flex_dev_utils_1.logger.coloredStrings.link;
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.error('There must be one and only one plugin loaded in each Flex plugin.');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info(strings_1.singleLineString("There are " + bold(count.toString()) + " plugin(s) being loaded in this source code.", "Check that the " + bold('src/index') + " file contains only one call to", bold('FlexPlugin.loadPlugin(...)') + ".", "For more information, please refer to " + link('https://www.twilio.com/docs/flex/plugins') + "."));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=loadPluginCountError.js.map