"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var general_1 = require("../utils/general");
var cracoUpgradeGuideLink = 'https://twilio.com';
/**
 * Upgrade notification
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var upgradeNotification = function (logger) { return function (skip) { return __awaiter(void 0, void 0, void 0, function () {
    var answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                flex_dev_utils_1.boxen.warning('You are about to upgrade your plugin to use the latest version of Flex Plugin CLI.');
                if (!!skip) return [3 /*break*/, 2];
                return [4 /*yield*/, flex_dev_utils_1.confirm('Please backup your plugin either locally or on GitHub. Do you want to continue?')];
            case 1:
                answer = _a.sent();
                if (!answer) {
                    general_1.exit(0);
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); }; };
/**
 * Upgrade to latest
 */
var upgradeToLatest = function (logger) { return function () {
    logger.info("@@Updating your plugin's dependencies to the latest version@@");
    logger.newline();
}; };
/**
 * Script started
 */
var scriptStarted = function (logger) { return function (version) {
    logger.info("@@**Upgrading your plugin from " + version + " to v4**@@");
    logger.newline();
}; };
/**
 * Script succeeded
 */
var scriptSucceeded = function (logger) { return function (needsInstall) {
    logger.newline();
    logger.success('🎉 Your plugin was successfully migrated to use the latest (v4) version of Flex Plugins CLI.');
    logger.newline();
    logger.info('**Next Steps:**');
    var helpInstruction = '{{$ twilio flex:plugins --help}} to find out more about the new CLI';
    if (needsInstall) {
        logger.info("Run {{$ npm install}} to update all the dependencies and then " + helpInstruction + ".");
    }
    else {
        logger.info("Run " + helpInstruction + ".");
    }
}; };
/**
 * Failed to update plugin's url
 */
var updatePluginUrl = function (logger) { return function (newline) {
    if (newline) {
        logger.newline();
    }
    logger.info(flex_dev_utils_1.singleLineString('> !!Could not update {{public/appConfig.js}} because your pluginService url has been modified.', "Please update the pluginService url to '/plugins'.", 'You may take a look at {{public/appConfig.example.js}} for guidance.!!'));
}; };
/**
 * Cannot remove craco because it has been modified
 */
var cannotRemoveCraco = function (logger) { return function (newline) {
    if (newline) {
        logger.newline();
    }
    logger.info(flex_dev_utils_1.singleLineString('> !!Cannot remove {{craco.config.js}} because it has been modified from its default value.', "Please review @@" + cracoUpgradeGuideLink + "@@ for more information.!!"));
}; };
/**
 * Required package not found
 */
var packageNotFound = function (logger) { return function (pkg) {
    logger.newline(2);
    logger.error("Could not find package **" + pkg + "** from npm repository; check your internet connection and try again.");
}; };
/**
 * Warns about upgrade from the provided version is not available
 */
var notAvailable = function (logger) { return function (version) {
    logger.error("No migration is available for your current version v" + version + ".");
}; };
/**
 * Warns that we could not remove a particular file or delete a script. Requires manual change
 */
var warnNotRemoved = function (logger) { return function (note) {
    logger.newline();
    logger.info("> !!" + note + ". Please review and remove it manually.!!");
}; };
/**
 * Remove legacy plugin notification
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var removeLegacyNotification = function (logger) { return function (pluginName, skip) { return __awaiter(void 0, void 0, void 0, function () {
    var name, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = flex_dev_utils_1.coloredStrings.name(pluginName);
                flex_dev_utils_1.boxen.warning("You are about to delete your legacy plugin " + name + " bundle hosted on Twilio Assets.");
                if (!!skip) return [3 /*break*/, 2];
                return [4 /*yield*/, flex_dev_utils_1.confirm('Please confirm that you have already migrated this plugin to use the Plugins API. Do you want to continue?')];
            case 1:
                answer = _a.sent();
                if (!answer) {
                    general_1.exit(0);
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); }; };
/**
 * No legacy plugin was found
 * @param logger
 */
var noLegacyPluginFound = function (logger) { return function (pluginName) {
    var name = flex_dev_utils_1.coloredStrings.name(pluginName);
    logger.info("Plugin bundle " + name + " was not found; it may have already been successfully migrated to Plugins API.");
    logger.newline();
    logger.info('**Next Steps:**');
    logger.info("Run {{$ twilio flex:plugins:describe:plugin --name " + name + "}} for more information on your plugin.");
}; };
/**
 * Remove legacy was successful
 * @param logger
 */
var removeLegacyPluginSucceeded = function (logger) { return function (pluginName) {
    var name = flex_dev_utils_1.coloredStrings.name(pluginName);
    logger.newline();
    logger.success("\uD83C\uDF89 Your legacy plugin " + name + " bundle was successfully removed from Twilio Assets. The migration of your plugin to Plugins API is now complete.");
    logger.newline();
}; };
/**
 * Warning about plugin not registed with plugins api yet
 */
var warningPluginNotInAPI = function (logger) { return function (pluginName) {
    var name = flex_dev_utils_1.coloredStrings.name(pluginName);
    logger.info("Plugin " + name + " has not been migrated to Plugins API.");
    logger.newline();
    logger.info("Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-beta \\-\\-install}} to upgrade your plugin code.");
    logger.info("Run {{$ twilio flex:plugins:deploy \\-\\-changelog \"migrating to Flex Plugins API\" \\-\\-major}} to register with Plugins API.");
    logger.info("Run {{$ twilio flex:plugins:upgrade-plugin --remove-legacy-plugin}} again after to finish migration.");
}; };
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (function (logger) { return ({
    upgradeNotification: upgradeNotification(logger),
    scriptStarted: scriptStarted(logger),
    upgradeToLatest: upgradeToLatest(logger),
    scriptSucceeded: scriptSucceeded(logger),
    updatePluginUrl: updatePluginUrl(logger),
    cannotRemoveCraco: cannotRemoveCraco(logger),
    packageNotFound: packageNotFound(logger),
    notAvailable: notAvailable(logger),
    warnNotRemoved: warnNotRemoved(logger),
    removeLegacyNotification: removeLegacyNotification(logger),
    noLegacyPluginFound: noLegacyPluginFound(logger),
    removeLegacyPluginSucceeded: removeLegacyPluginSucceeded(logger),
    warningPluginNotInAPI: warningPluginNotInAPI(logger),
}); });
//# sourceMappingURL=upgradePlugin.js.map