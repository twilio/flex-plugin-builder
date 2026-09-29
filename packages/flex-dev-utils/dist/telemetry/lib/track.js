"use strict";
/**
 * Script to call Segment Track method with the track payload
 * This is used when Segment APIs need to be called in a daemon process asynchronously
 */
Object.defineProperty(exports, "__esModule", { value: true });
var telemetry_1 = require("./telemetry");
telemetry_1.track(JSON.parse(process.argv[2]));
//# sourceMappingURL=track.js.map