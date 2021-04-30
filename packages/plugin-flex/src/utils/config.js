"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopic = void 0;
var fs_1 = require("flex-dev-utils/dist/fs");
/**
 * Reads the topic information from package.json
 * @param topicName the topic name to read
 */
var getTopic = function (topicName) {
    var _a;
    var pkg = fs_1.readJsonFile(__dirname, '../../package.json');
    if (!((_a = pkg === null || pkg === void 0 ? void 0 : pkg.oclif) === null || _a === void 0 ? void 0 : _a.topics[topicName])) {
        return {
            description: 'No description available',
            flags: {},
            args: {},
            defaults: {},
        };
    }
    var topic = pkg.oclif.topics[topicName];
    topic.flags = topic.flags || {};
    topic.args = topic.args || {};
    topic.defaults = topic.defaults || {};
    return topic;
};
exports.getTopic = getTopic;
//# sourceMappingURL=config.js.map