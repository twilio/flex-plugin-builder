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
/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
var matchers = __importStar(require("./matchers"));
var scripts = __importStar(require("./utils"));
if (expect) {
    var extensions = Object.keys(matchers)
        .filter(function (k) { return k.charAt(0).toLocaleLowerCase() === k.charAt(0); })
        .reduce(function (extension, key) {
        // eslint-disable-next-line import/namespace, @typescript-eslint/no-explicit-any
        extension[key] = function (actual) {
            var _a;
            var expected = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                expected[_i - 1] = arguments[_i];
            }
            return (_a = matchers[key](actual)).match.apply(_a, __spreadArray([], __read(expected)));
        };
        return extension;
    }, {});
    expect.extend(extensions);
    // @ts-ignore
    global.utils = scripts;
}
else {
    // eslint-disable-next-line no-console
    console.error("Unable to find Jest's global expect");
}
//# sourceMappingURL=index.js.map