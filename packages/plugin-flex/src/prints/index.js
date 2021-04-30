"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var upgradePlugin_1 = __importDefault(require("./upgradePlugin"));
var deploy_1 = __importDefault(require("./deploy"));
var release_1 = __importDefault(require("./release"));
var flexPlugin_1 = __importDefault(require("./flexPlugin"));
var archiveResource_1 = __importDefault(require("./archiveResource"));
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (function (logger) {
    return {
        upgradePlugin: upgradePlugin_1.default(logger),
        deploy: deploy_1.default(logger),
        release: release_1.default(logger),
        flexPlugin: flexPlugin_1.default(logger),
        archiveResource: archiveResource_1.default(logger),
    };
});
//# sourceMappingURL=index.js.map