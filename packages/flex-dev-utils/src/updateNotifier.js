"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUpdate = void 0;
var update_notifier_1 = __importDefault(require("update-notifier"));
var fs_1 = require("./fs");
exports.default = update_notifier_1.default;
/**
 * Checks for update for the package
 */
/* istanbul ignore next */
// eslint-disable-next-line import/no-unused-modules
var checkForUpdate = function () {
    var pkg = module.parent ? fs_1.readPackageJson(fs_1.findUp(module.parent.filename, 'package.json')) : fs_1.readAppPackageJson();
    update_notifier_1.default({ pkg: pkg }).notify();
};
exports.checkForUpdate = checkForUpdate;
//# sourceMappingURL=updateNotifier.js.map