"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionSatisfiesRange = exports.SemVer = void 0;
var semver_1 = __importStar(require("semver"));
Object.defineProperty(exports, "SemVer", { enumerable: true, get: function () { return semver_1.SemVer; } });
exports.default = semver_1.default;
/**
 * Checks whether the provided version satisfies the given range. The provided version is coerced first
 * @param version the version to test
 * @param range the range to check
 */
var versionSatisfiesRange = function (version, range) {
    var _a;
    return semver_1.default.satisfies((_a = semver_1.default.coerce(version)) === null || _a === void 0 ? void 0 : _a.version, range);
};
exports.versionSatisfiesRange = versionSatisfiesRange;
//# sourceMappingURL=semver.js.map