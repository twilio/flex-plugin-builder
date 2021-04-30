"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_1 = require("flex-dev-utils/dist/fs");
/**
 * Prints the success message when dev-server compiles
 * @param local     the local port
 * @param network   the local network
 * @param localPlugins  the list of local plugins
 * @param remotePlugins the list of remote plugins
 * @param hasRemote whether remote plugins are running
 */
exports.default = (function (local, network, localPlugins, remotePlugins, hasRemote) {
    flex_dev_utils_1.logger.success('Compiled successfully!');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("Your plugin app is running in the browser on:");
    flex_dev_utils_1.logger.newline();
    var srcs = [
        ['Local', "!!" + local.url + "!!"],
        ['Network', "!!" + network.url + "!!"],
    ];
    flex_dev_utils_1.logger.columns(srcs, { indent: true });
    if (localPlugins.length) {
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.info('**Local Plugins:**');
        flex_dev_utils_1.logger.newline();
        var rows = localPlugins.map(function (name) {
            var plugin = fs_1.readPluginsJson().plugins.find(function (p) { return p.name === name; });
            return ["" + plugin.name, "!!" + plugin.dir + "!!"];
        });
        flex_dev_utils_1.logger.columns(rows, { indent: true });
    }
    if (hasRemote) {
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.info('**Remote Plugins:**');
        flex_dev_utils_1.logger.newline();
        var rows = remotePlugins.length
            ? remotePlugins.map(function (p) { return [p.name + "..@.." + p.version, "!!" + p.src + "!!"]; })
            : [['Will be displayed when you log into your Flex application']];
        flex_dev_utils_1.logger.columns(rows, { indent: true });
    }
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info('This is a development build and is not intended to be used for production.');
    flex_dev_utils_1.logger.info('To create a production build, use:');
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.installInfo('twilio', 'flex:plugins:build');
});
//# sourceMappingURL=devServerSuccessful.js.map