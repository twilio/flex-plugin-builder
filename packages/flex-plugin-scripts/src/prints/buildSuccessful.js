"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var env_1 = require("flex-dev-utils/dist/env");
var fs_1 = require("flex-dev-utils/dist/fs");
/**
 * Prints the successful message when a build has successfully compiled
 */
exports.default = (function (bundles, warnings) {
    if (warnings && warnings.length) {
        var pkgName = flex_dev_utils_1.logger.colors.yellow.bold(fs_1.getPaths().app.name);
        flex_dev_utils_1.logger.error("Plugin " + pkgName + " was successfully compiled with some warnings.");
        flex_dev_utils_1.logger.newline();
        warnings.forEach(function (warning, index) {
            var title = flex_dev_utils_1.logger.colors.bold("Warning " + (index + 1));
            flex_dev_utils_1.logger.info(title);
            flex_dev_utils_1.logger.info(warning);
        });
    }
    else {
        var pkgName = flex_dev_utils_1.logger.colors.green.bold(fs_1.getPaths().app.name);
        flex_dev_utils_1.logger.success("Plugin " + pkgName + " was successfully compiled.");
    }
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info(bundles.length, 'files were compiled:');
    bundles.forEach(function (bundle) {
        var size = Math.round((bundle.size / 1024) * 10) / 10;
        var path = flex_dev_utils_1.logger.colors.gray('build') + "/" + bundle.name;
        flex_dev_utils_1.logger.info('\t', size, 'KB', '\t', path);
    });
    // Build command invoked directly, and not as a predeploy script
    if (flex_dev_utils_1.env.isLifecycle(env_1.Lifecycle.Build)) {
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.info('Your', flex_dev_utils_1.logger.colors.bold('plugin'), 'is now ready to be deployed.');
        flex_dev_utils_1.logger.info('You can deploy it to Twilio using:');
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.installInfo('npm', 'run deploy');
    }
});
//# sourceMappingURL=buildSuccessful.js.map