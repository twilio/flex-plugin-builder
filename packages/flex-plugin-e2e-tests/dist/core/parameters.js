"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testScenarios = exports.testParams = exports.homeDir = void 0;
var path_1 = require("path");
var os_1 = require("os");
var semver_1 = __importDefault(require("semver"));
var _a = process.env, TWILIO_REGION = _a.TWILIO_REGION, LOCALHOST_PORT = _a.LOCALHOST_PORT;
var pluginName = 'flex-e2e-tester-plugin';
var pluginName2 = 'flex-e2e-tester-plugin-2';
var pluginName3 = 'flex-e2e-tester-plugin-3';
var consoleBaseUrl = TWILIO_REGION ? "https://www." + TWILIO_REGION + ".twilio.com" : 'https://www.twilio.com';
var hostedFlexBaseUrl = TWILIO_REGION ? "https://flex." + TWILIO_REGION + ".twilio.com" : 'https://flex.twilio.com';
var operatingSystem = os_1.platform();
var consoleEmail = "CONSOLE_EMAIL_" + operatingSystem;
var accountSid = "TWILIO_ACCOUNT_SID_" + operatingSystem;
var authToken = "TWILIO_AUTH_TOKEN_" + operatingSystem;
// These are required parameters - verify otherwise throw an error
var requiredEnvs = [accountSid, authToken, consoleEmail, 'CONSOLE_PASSWORD'];
requiredEnvs.forEach(function (env) {
    if (!process.env[env]) {
        throw new Error(env + " is required");
    }
});
// Export parameters for use
exports.homeDir = path_1.join(process.env.HOME, '.local');
exports.testParams = {
    environment: {
        __hidden: false,
        path: process.env.PATH,
        nodeVersion: process.version,
        homeDir: exports.homeDir,
        operatingSystem: operatingSystem,
        cwd: process.cwd(),
        ignorePrefix: process.env.NPM_IGNORE_PREFIX === 'true' || false,
        nodeOptions: semver_1.default.gte(process.version, '17.0.0') ? '--openssl-legacy-provider' : undefined,
    },
    secrets: {
        __hidden: true,
        console: {
            email: process.env[consoleEmail],
            password: process.env.CONSOLE_PASSWORD,
        },
        api: {
            accountSid: process.env[accountSid],
            authToken: process.env[authToken],
        },
    },
    config: {
        start: {
            timeout: 30000,
            pollInterval: 1000,
        },
        __hidden: false,
        consoleBaseUrl: process.env.CONSOLE_BASE_URL || consoleBaseUrl,
        hostedFlexBaseUrl: process.env.HOSTED_FLEX_BASE_URL || hostedFlexBaseUrl,
        region: TWILIO_REGION || '',
        regionFlag: [],
        localhostPort: Number(LOCALHOST_PORT) || 3000,
    },
    scenario: {
        __hidden: false,
        packageVersion: process.env.PACKAGE_VERSION,
        plugins: [
            {
                name: pluginName,
                dir: path_1.join(exports.homeDir, pluginName),
                componentText: "This is a dismissible demo component " + Date.now(),
                localhostUrl: 'http://localhost:3000' || process.env.PLUGIN_BASE_URL,
            },
            {
                name: pluginName2,
                dir: path_1.join(exports.homeDir, pluginName2),
                componentText: "This is a dismissible demo component for plugin2 " + Date.now(),
                localhostUrl: 'http://localhost:3000' || process.env.PLUGIN_BASE_URL,
            },
            {
                name: pluginName3,
                dir: path_1.join(exports.homeDir, pluginName3),
                componentText: "This is a dismissible demo component for plugin3 " + Date.now(),
                localhostUrl: 'http://localhost:3000' || process.env.PLUGIN_BASE_URL,
            },
        ],
    },
};
// Set the region
if (exports.testParams.config.region) {
    exports.testParams.config.regionFlag.push('--region', exports.testParams.config.region);
}
// Overwrite flexUIVersion
if (process.env.FLEX_UI_VERSION && semver_1.default.valid(process.env.FLEX_UI_VERSION)) {
    exports.testParams.scenario.flexUIVersion = process.env.FLEX_UI_VERSION;
}
// All test scenarios to run
exports.testScenarios = [
    {
        isTS: false,
    },
    {
        isTS: true,
    },
];
//# sourceMappingURL=parameters.js.map