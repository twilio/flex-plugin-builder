"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypeReferenceDirective = exports.resolveModuleName = void 0;
var ts_pnp_1 = require("ts-pnp");
var resolveModuleName = function (typescript, moduleName, containingFile, compilerOptions, resolutionHost) {
    return ts_pnp_1.resolveModuleName(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveModuleName);
};
exports.resolveModuleName = resolveModuleName;
var resolveTypeReferenceDirective = function (typescript, moduleName, containingFile, compilerOptions, resolutionHost) {
    return ts_pnp_1.resolveModuleName(moduleName, containingFile, compilerOptions, resolutionHost, typescript.resolveModuleName);
};
exports.resolveTypeReferenceDirective = resolveTypeReferenceDirective;
//# sourceMappingURL=pnpTs.js.map