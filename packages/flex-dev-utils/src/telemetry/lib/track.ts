import { env } from '@twilio/flex-plugins-utils-env';
import Analytics, { TrackParams } from '@segment/analytics-node';

import { DEV_VALUE, PROD_VALUE, STAGE_VALUE } from './constants';

function getKey(): string {
  const region: string = env.getRegion();
  if (region === 'stage') {
    return STAGE_VALUE;
  } else if (region === 'dev') {
    return DEV_VALUE;
  }
  return PROD_VALUE;
}

function send(traceData: TrackParams): void {
  const analytics = new Analytics({ writeKey: getKey() });
  analytics.track(traceData);
}

send(JSON.parse(process.argv[2]));
