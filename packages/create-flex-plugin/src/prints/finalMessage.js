"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
var headline = flex_dev_utils_1.logger.coloredStrings.headline;
/**
 * Prints the final message after the successful creation of a new project
 * @param config
 */
exports.default = (function (config) {
    var installCommand = config.yarn ? 'yarn install' : 'npm install';
    var setupMessage = strings_1.multilineString("" + headline('Setup:'), "$ cd " + config.name + "/", "$ " + installCommand);
    var devMessage = strings_1.multilineString("" + headline('Development:'), "$ cd " + config.name + "/", "$ twilio flex:plugins:start");
    var buildMessage = strings_1.multilineString("" + headline('Build Command:'), "$ cd " + config.name + "/", "$ twilio flex:plugins:build");
    var deployMessage = strings_1.multilineString("" + headline('Deploy Command:'), "$ cd " + config.name + "/", "$ twilio flex:plugins:deploy");
    var message = strings_1.multilineString("Your Twilio Flex Plugin project has been successfully created!", (config.install ? '' : "\n\n " + setupMessage) + "\n", devMessage + "\n", buildMessage + "\n", deployMessage + "\n", 'For more info check the README.md file or go to:', '➡ https://www.twilio.com/docs/flex');
    var columns = (process.stdout.columns || 100) - 14;
    message = flex_dev_utils_1.logger.wrap(message, columns, { hard: true });
    flex_dev_utils_1.boxen.info(message, false);
});
//# sourceMappingURL=finalMessage.js.map