import Telemetry from '../telemetry';
import * as fsScripts from '../../../fs';

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should instantiate with correct common properties', () => {
    const telemetry = new Telemetry();
    expect(telemetry).toBeDefined();
    // @ts-ignore
    expect(telemetry.commonProperties.pluginName).toEqual('test-plugin');
    // @ts-ignore
    expect(telemetry.commonProperties.typescript).toBeTruthy();
  });

  it('tracks an event with the correct data', () => {
    const telemetry = new Telemetry();
    const testEvent = 'testEvent';
    const testAccountSid = 'ACxxxxxxxxxxxxxx';
    const testProperties = { testKey: 'testValue' };

    process.env.CI = '';
    telemetry.track(testEvent, testAccountSid, testProperties);

    // @ts-ignore
    expect(telemetry.analytics.track).toHaveBeenCalledWith({
      userId: testAccountSid,
      event: testEvent,
      properties: expect.objectContaining({
        product: 'Flex',
        source: 'flexpluginscli',
        flexUserRole: 'admin',
        typescript: true,
        accountSid: testAccountSid,
        testKey: 'testValue',
      }),
    });
  });

  it('should not track for ci', () => {
    const telemetry = new Telemetry();
    const testEvent = 'testEvent';
    const testAccountSid = 'ACxxxxxxxxxxxxxx';
    const testProperties = { testKey: 'testValue' };
    process.env.CI = 'true';

    telemetry.track(testEvent, testAccountSid, testProperties);

    // @ts-ignore
    expect(telemetry.analytics.track).not.toHaveBeenCalled();
  });
});
