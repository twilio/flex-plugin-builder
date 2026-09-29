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
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var prints_1 = require("@twilio/flex-dev-utils/dist/prints");
exports.default = (function (type, size, max) {
    flex_dev_utils_1.env.setQuiet(false);
    // Round to 1 decimal
    size = Math.round(size * 10) / 10;
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info("--Plugin " + type + " size **" + size + "MB** exceeds allowed limit of **" + max + "MB**.--");
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.info('Consider the following optimizations:');
    var lines = [
        'Host your image files on Twilio Assets instead of bundling them with your plugin',
        'Use SVG instead of PNG/JPEG/GIF image formats',
    ];
    prints_1.printList.apply(void 0, __spreadArray([], __read(lines)));
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=fileTooLarge.js.map