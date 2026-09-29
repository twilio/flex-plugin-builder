"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSuites = void 0;
var fs_1 = require("fs");
/**
 * All the test suites that need to run
 */
exports.testSuites = fs_1.readdirSync(__dirname + "/../tests")
    .filter(function (f) { return f.endsWith('.js'); })
    .filter(function (f) { return f.startsWith('step'); })
    .sort(function (l, r) {
    if (parseInt(l.split('step')[1], 10) > parseInt(r.split('step')[1], 10)) {
        return 1;
    }
    return -1;
});
//# sourceMappingURL=suites.js.map