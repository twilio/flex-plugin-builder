"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.track = void 0;
var os = __importStar(require("os"));
var path_1 = require("path");
var daemonize_process_1 = __importDefault(require("daemonize-process"));
var analytics_node_1 = __importDefault(require("@segment/analytics-node"));
var constants_1 = require("./constants");
var fs = __importStar(require("../../fs"));
var env_1 = require("../../env");
var getKey = function () {
    var region = env_1.env.getRegion();
    if (region === 'stage') {
        return constants_1.STAGE_VALUE;
    }
    else if (region === 'dev') {
        return constants_1.DEV_VALUE;
    }
    return constants_1.PROD_VALUE;
};
var track = function (payload) {
    var analytics = new analytics_node_1.default({ writeKey: getKey(), flushAt: 1 });
    analytics.track(payload);
};
exports.track = track;
var Telemetry = /** @class */ (function () {
    /**
     * Creates an analytics instance
     *
     */
    function Telemetry(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.runAsync, runAsync = _c === void 0 ? true : _c;
        this.runAsync = runAsync;
        var env = process.env;
        var language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
        var pluginName = 'n/a';
        var pluginVersion = 'n/a';
        var typescript = false;
        var flexUiVersion = 'n/a';
        if (fs.isPluginFolder()) {
            pluginName = fs.getPaths().app.name;
            pluginVersion = fs.getPaths().app.version;
            typescript = fs.getPaths().app.isTSProject();
            flexUiVersion = fs.getPackageVersion("@twilio/flex-ui");
        }
        this.commonProperties = {
            product: constants_1.PRODUCT,
            source: constants_1.SOURCE,
            realm: this.getRealm(),
            flexUserRole: 'admin',
            pluginName: pluginName,
            pluginVersion: pluginVersion,
            locale: language,
            osDetail: this.getOsDetails(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            typescript: typescript,
            nodeVersion: process.version.slice(1),
            flexUiVersion: flexUiVersion,
        };
    }
    /**
     * Records any event or actions that users perform.
     * @param event Event name
     * @param properties Event properties
     */
    Telemetry.prototype.track = function (event, accountSid, properties) {
        var payload = {
            userId: accountSid,
            event: event,
            properties: __assign(__assign(__assign({}, this.commonProperties), { accountSid: accountSid }), properties),
        };
        if (!env_1.env.isCI()) {
            // Fork a new process for the daemon
            if (this.runAsync) {
                daemonize_process_1.default({
                    script: path_1.join(__dirname, 'track.js'),
                    arguments: [JSON.stringify(payload)],
                });
            }
            else {
                exports.track(payload);
            }
        }
    };
    Telemetry.prototype.getOsDetails = function () {
        return {
            osType: os.type(),
            osName: os.platform(),
            osVersion: os.release(),
        };
    };
    Telemetry.prototype.getRealm = function () {
        var region = env_1.env.getRegion();
        if (region === 'stage') {
            return 'stage-us1';
        }
        else if (region === 'dev') {
            return 'dev-us1';
        }
        return 'us1';
    };
    return Telemetry;
}());
exports.default = Telemetry;
//# sourceMappingURL=telemetry.js.map