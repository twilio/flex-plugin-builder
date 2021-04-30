"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildStatus = exports.Visibility = exports.FileVisibility = void 0;
/* eslint-disable camelcase, import/no-unused-modules */
var FileVisibility;
(function (FileVisibility) {
    FileVisibility["Public"] = "Public";
    FileVisibility["Protected"] = "Protected";
})(FileVisibility = exports.FileVisibility || (exports.FileVisibility = {}));
var Visibility;
(function (Visibility) {
    Visibility["Public"] = "public";
    Visibility["Protected"] = "protected";
})(Visibility = exports.Visibility || (exports.Visibility = {}));
var BuildStatus;
(function (BuildStatus) {
    BuildStatus["Building"] = "building";
    BuildStatus["Completed"] = "completed";
    BuildStatus["Failed"] = "failed";
})(BuildStatus = exports.BuildStatus || (exports.BuildStatus = {}));
//# sourceMappingURL=serverless-types.js.map