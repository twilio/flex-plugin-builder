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
/* eslint-disable @typescript-eslint/no-explicit-any */
var assert_1 = require("assert");
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var lodash_1 = require("lodash");
var _strictEqual = function (doesEqual, actual, expected, msg) {
    if (doesEqual) {
        assert_1.deepStrictEqual(actual, expected, msg);
    }
    else {
        assert_1.notDeepStrictEqual(actual, expected, msg);
    }
};
var equal = function (doesEqual) {
    return function (actual, expected, msg) {
        _strictEqual(doesEqual, actual, expected, msg);
    };
};
/**
 * Checks whether a file/directory exists
 */
var fileExists = function (doesEqual) {
    return function (paths, msg) {
        _strictEqual(doesEqual, true, fs.existsSync(path.join.apply(path, __spreadArray([], __read(paths)))), msg);
    };
};
/**
 * Checks whether the JSON file contains the given key:value pair
 */
var jsonFileContains = function (doesEqual) {
    return function (paths, key, value, msg) {
        _strictEqual(doesEqual, value, lodash_1.get(JSON.parse(fs.readFileSync(path.join.apply(path, __spreadArray([], __read(paths))), 'utf-8')), key), msg);
    };
};
var stringContains = function (doesEqual) { return function (line, str, msg) {
    _strictEqual(doesEqual, true, line.includes(str), msg);
}; };
/**
 * Checks whether the file contains the given string
 */
var fileContains = function (doesEqual) { return function (paths, value, msg) {
    var file = path.join.apply(path, __spreadArray([], __read(paths)));
    var not = doesEqual ? ' not ' : ' ';
    msg = msg || file + " does" + not + "contain " + value;
    stringContains(doesEqual)(fs.readFileSync(file, 'utf-8'), value, msg);
}; };
/**
 * Checks whether the directory is empty
 */
var dirIsEmpty = function (doesEqual) { return function (paths, msg) {
    _strictEqual(doesEqual, 0, fs.readdirSync(path.join.apply(path, __spreadArray([], __read(paths)))).length, msg);
}; };
/**
 * Checks whether the object is null
 */
var isNull = function (doesEqual) { return function (obj, msg) {
    if (doesEqual) {
        assert_1.deepEqual(obj, null, msg);
    }
    else {
        assert_1.notDeepEqual(obj, null, msg);
    }
}; };
/**
 * Checks whether the object is underfined
 */
var isUndefined = function (doesEqual) { return function (obj, msg) {
    if (doesEqual) {
        assert_1.deepEqual(obj, undefined, msg);
    }
    else {
        assert_1.notDeepEqual(obj, undefined, msg);
    }
}; };
exports.default = {
    equal: equal(true),
    fileExists: fileExists(true),
    jsonFileContains: jsonFileContains(true),
    fileContains: fileContains(true),
    dirIsEmpty: dirIsEmpty(true),
    stringContains: stringContains(true),
    isNull: isNull(true),
    isUndefined: isUndefined(true),
    not: {
        fileExists: fileExists(false),
        jsonFileContains: jsonFileContains(false),
        fileContains: fileContains(false),
        dirIsEmpty: dirIsEmpty(false),
        stringContains: stringContains(false),
        equal: equal(false),
        isNull: isNull(false),
        isUndefined: isUndefined(false),
    },
    app: (function () {
        var view;
        return {
            get view() {
                if (view) {
                    return view;
                }
                throw new Error('You must call init before accessing app assert');
            },
            init: function (value) {
                view = value.assert;
            },
        };
    })(),
};
//# sourceMappingURL=assertion.js.map