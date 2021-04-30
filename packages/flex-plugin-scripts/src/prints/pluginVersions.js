"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var serverless_types_1 = require("../clients/serverless-types");
var VERSION_MATCH_REGEX = /^\/plugins\/.*\/(.*)\/bundle.js$/;
var warningMsg = 'You plugin does not follow SemVer versioning; the list below may not be ordered.';
/**
 * Prints the list of versions of the plugin in the provided order
 *
 * @param domainName  the Twilio Runtime domain
 * @param versions    the list of versions
 * @param order       the order to display the result
 */
exports.default = (function (domainName, versions, order) {
    var list = versions.map(function (version) {
        var match = version.path.match(VERSION_MATCH_REGEX);
        return {
            type: version.visibility === serverless_types_1.Visibility.Protected ? 'Private' : 'Public',
            version: match ? match[1] : 'N/A',
            url: "https://" + domainName + version.path,
        };
    });
    var isSemver = list.every(function (v) { return flex_dev_utils_1.semver.valid(v.version) !== null; });
    var rows;
    if (isSemver) {
        var _list = list.map(function (v) { return v.version; });
        var sortedVersions = order === 'asc' ? flex_dev_utils_1.semver.sort(_list) : flex_dev_utils_1.semver.rsort(_list);
        rows = sortedVersions.map(function (version) { return list.find(function (v) { return v.version === version; }); });
    }
    else {
        flex_dev_utils_1.logger.warning(warningMsg);
        rows = list;
    }
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.table.printObjectArray(rows);
    flex_dev_utils_1.logger.newline();
});
//# sourceMappingURL=pluginVersions.js.map