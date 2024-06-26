/**
 * Script to call Segment Track method with the track payload
 * This is used when Segment APIs need to be called in a daemon process asynchronously
 */

import { track } from './telemetry';

track(JSON.parse(process.argv[2]));
