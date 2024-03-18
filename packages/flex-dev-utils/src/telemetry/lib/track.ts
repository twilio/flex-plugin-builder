import { env } from '@twilio/flex-plugins-utils-env';
import { DEV_VALUE, PROD_VALUE, STAGE_VALUE } from './constants';
import Analytics, { TrackParams } from '@segment/analytics-node';

function send(traceData: TrackParams) {
  const analytics = new Analytics({ writeKey: getKey() });
  analytics.track(traceData);
}

function getKey() {
  const region = env.getRegion();
  if (region === 'stage') {
    return STAGE_VALUE;
  } else if (region === 'dev') {
    return DEV_VALUE;
  }
  return PROD_VALUE;
}

send(JSON.parse(process.argv[2]));
