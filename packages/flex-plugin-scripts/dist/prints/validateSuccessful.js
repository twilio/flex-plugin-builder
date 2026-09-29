"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
// eslint-disable-next-line sonarjs/cognitive-complexity
var printWarnings = function (issues) {
    var e_1, _a, e_2, _b;
    try {
        for (var issues_1 = __values(issues), issues_1_1 = issues_1.next(); !issues_1_1.done; issues_1_1 = issues_1.next()) {
            var issue = issues_1_1.value;
            var filePaths = issue.file.split(path_1.sep).slice(2);
            var file = path_1.resolve.apply(void 0, __spreadArray([fs_1.getPaths().cwd], __read(filePaths)));
            try {
                for (var _c = (e_2 = void 0, __values(issue.warnings)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var warning = _d.value;
                    var _e = warning.location, _f = _e === void 0 ? {} : _e, line = _f.line, column = _f.column, warningMessage = warning.warningMessage, _g = warning.recommendation, _h = _g.code, code = _h === void 0 ? '' : _h, _j = _g.message, message = _j === void 0 ? '' : _j, link = _g.link;
                    if (line !== undefined && column !== undefined) {
                        flex_dev_utils_1.logger.newline();
                        flex_dev_utils_1.logger.log(flex_dev_utils_1.logger.coloredStrings.link(flex_dev_utils_1.logger.coloredStrings.underline(file + ":" + line + ":" + (column + 1))));
                    }
                    flex_dev_utils_1.logger.newline();
                    flex_dev_utils_1.logger.log(flex_dev_utils_1.logger.coloredStrings.warning('Warning:') + " " + warningMessage);
                    if (message) {
                        flex_dev_utils_1.logger.newline();
                        flex_dev_utils_1.logger.log(flex_dev_utils_1.logger.coloredStrings.success('Recommendation:') + " " + message);
                        if (code) {
                            flex_dev_utils_1.logger.newline();
                            flex_dev_utils_1.logger.log(flex_dev_utils_1.logger.coloredStrings.code(code));
                        }
                        if (link) {
                            flex_dev_utils_1.logger.newline();
                            flex_dev_utils_1.logger.log("For more details, visit: " + flex_dev_utils_1.logger.coloredStrings.underline(link) + "\n");
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (issues_1_1 && !issues_1_1.done && (_a = issues_1.return)) _a.call(issues_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.default = (function (report) {
    var _a;
    var noDeprecatedWarnings = report.api_compatibility.reduce(function (acc, warning) {
        acc += warning.warnings.length;
        return acc;
    }, 0);
    var noDependencyWarnings = ((_a = report.version_compatibility[0]) === null || _a === void 0 ? void 0 : _a.warnings.length) || 0;
    if (noDeprecatedWarnings > 0 || noDependencyWarnings > 0) {
        if (noDeprecatedWarnings > 0) {
            printWarnings(report.api_compatibility);
        }
        if (noDependencyWarnings > 0) {
            flex_dev_utils_1.logger.newline();
            flex_dev_utils_1.logger.info(flex_dev_utils_1.logger.coloredStrings.link(flex_dev_utils_1.logger.coloredStrings.underline(fs_1.getPaths().app.pkgPath)));
            printWarnings(report.version_compatibility);
            flex_dev_utils_1.logger.newline();
        }
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.warning(flex_dev_utils_1.logger.coloredStrings.bold(flex_dev_utils_1.logger.coloredStrings.error("\u2716 Validation complete. Found " + (noDeprecatedWarnings + noDependencyWarnings) + " issues")));
        flex_dev_utils_1.logger.info(flex_dev_utils_1.logger.coloredStrings.dim(flex_dev_utils_1.logger.coloredStrings.bold('Note:') + " Validation does not check for compilation or syntax errors"));
        flex_dev_utils_1.logger.newline();
    }
    else {
        flex_dev_utils_1.logger.newline();
        flex_dev_utils_1.logger.success("Validation complete. Found " + flex_dev_utils_1.logger.coloredStrings.digit(0) + " issues \uD83C\uDF89");
    }
});
//# sourceMappingURL=validateSuccessful.js.map