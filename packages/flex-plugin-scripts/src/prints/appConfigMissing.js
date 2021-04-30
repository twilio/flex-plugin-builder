"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var strings_1 = require("flex-dev-utils/dist/strings");
var link = flex_dev_utils_1.logger.coloredStrings.link;
/**
 * Error about appConfig.js missing
 */
exports.default = (function () {
    var nameColor = flex_dev_utils_1.logger.coloredStrings.name;
    var headline = flex_dev_utils_1.logger.coloredStrings.headline;
    var scriptName = nameColor('flex-plugin-scripts');
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.error('There might be a problem with your project file hierarchy.');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("The " + scriptName + " requires the following file to be present:");
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("\t " + headline('public/appConfig.js'));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info(strings_1.singleLineString("Check your " + link('public/') + " directory for " + link('appConfig.example.js') + ",", "copy it to " + link('appConfig.js') + ", and modify your Account Sid and Service URL."));
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=appConfigMissing.js.map