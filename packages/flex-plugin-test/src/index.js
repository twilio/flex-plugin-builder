"use strict";
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
/* eslint-disable import/no-unused-modules */
var path_1 = require("path");
var fs_1 = require("flex-dev-utils/dist/fs");
var defaultSetupFile = path_1.join(__dirname, '../templates/setupTests.js');
/**
 * Main method for generating a default Jest configuration
 */
exports.default = (function () {
    var paths = fs_1.getPaths();
    var setupTestsFile = paths.app.setupTestsPaths.find(function (x) { return fs_1.checkFilesExist(x); });
    return {
        roots: ['<rootDir>/src'],
        moduleDirectories: [
            'node_modules',
            paths.app.nodeModulesDir,
            paths.scripts.nodeModulesDir,
            paths.cli.nodeModulesDir,
        ],
        collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
        setupFiles: [require.resolve('react-app-polyfill/jsdom')],
        setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [defaultSetupFile],
        testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
        transform: {
            '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': require.resolve('./jestTransforms/babel'),
            '^.+\\.css$': require.resolve('./jestTransforms/css'),
        },
        transformIgnorePatterns: [
            '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
            '^.+\\.module\\.(css|sass|scss)$',
        ],
        moduleNameMapper: {
            '^src/(.*)$': '<rootDir>/src/$1',
        },
        moduleFileExtensions: __spreadArray(__spreadArray([], __read(fs_1.getPaths().extensions)), ['node']).filter(function (e) { return !e.includes('mjs'); }),
        watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    };
});
//# sourceMappingURL=index.js.map