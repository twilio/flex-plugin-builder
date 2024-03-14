import * as os from 'os';

import Analytics from '@segment/analytics-node';

import Telemetry from '../telemetry';
import * as fsScripts from '../../../fs';
import { env } from '../../../env';
import { logger } from '../../../logger';

jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('Telemetry', () => {
  const paths = {
    app: { name: 'test-plugin', version: '1.0.0', isTSProject: () => true },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
    jest.spyOn(fsScripts, 'getPackageVersion').mockReturnValue('1.24.0');
    jest.spyOn(fsScripts, 'isPluginFolder').mockReturnValue(true);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should instantiate with correct common properties', () => {
    const telemetry = new Telemetry();
    expect(telemetry).toBeDefined();
    expect(Analytics).toHaveBeenCalled();
    expect(telemetry.commonProperties.pluginName).toEqual('test-plugin');
    expect(telemetry.commonProperties.typescript).toBeTruthy();
  });

  it('tracks an event with the correct data', () => {
    const telemetry = new Telemetry();
    const testEvent = 'testEvent';
    const testAccountSid = 'ACxxxxxxxxxxxxxx';
    const testProperties = { key: 'value' };

    telemetry.track(testEvent, testAccountSid, testProperties);

    // @ts-ignore
    expect(telemetry.analytics.track).toHaveBeenCalledWith({
      userId: testAccountSid,
      event: testEvent,
      properties: expect.objectContaining({
        accountSid: testAccountSid,
        key: 'value',
        // Add other properties checks as necessary
      }),
    });
  });
});
