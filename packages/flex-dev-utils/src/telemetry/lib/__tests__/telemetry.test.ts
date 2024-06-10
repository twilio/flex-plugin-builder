import { join } from 'path';

import daemonizeProcess from 'daemonize-process';

import * as telemetryLib from '../telemetry';
import * as fsScripts from '../../../fs';

const Telemetry = telemetryLib.default;

jest.mock('daemonize-process', () => {
  return jest.fn();
});

describe('Telemetry', () => {
  const paths = {
    app: { name: 'test-plugin', version: '1.0.0', isTSProject: () => true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
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

  describe('track', () => {
    it('should instantiate with correct common properties', () => {
      process.env.LANG = 'test-lang';
      const telemetry = new Telemetry();
      expect(telemetry).toBeDefined();
      // @ts-ignore
      expect(telemetry.commonProperties.pluginName).toEqual('test-plugin');
      // @ts-ignore
      expect(telemetry.commonProperties.locale).toEqual('test-lang');
      // @ts-ignore
      expect(telemetry.commonProperties.typescript).toBeTruthy();
    });

    it('call track daemon', () => {
      const telemetry = new Telemetry();
      const testEvent = 'testEvent';
      const testAccountSid = 'ACxxxxxxxxxxxxxx';
      const testProperties = { testKey: 'testValue' };

      process.env.CI = '';
      process.env.LANG = 'test-lang';
      telemetry.track(testEvent, testAccountSid, testProperties);
      expect(daemonizeProcess).toHaveBeenCalled();
    });

    it('call track daemon with correct values', () => {
      const telemetry = new Telemetry();
      const testEvent = 'testEvent';
      const testAccountSid = 'ACxxxxxxxxxxxxxx';
      const testProperties = { testKey: 'testValue' };

      process.env.CI = '';

      telemetry.track(testEvent, testAccountSid, testProperties);

      expect(daemonizeProcess).toHaveBeenCalled();
      const expectedTraceData = {
        userId: testAccountSid,
        event: 'testEvent',
        properties: {
          // @ts-ignore
          ...telemetry.commonProperties,
          accountSid: testAccountSid,
          ...testProperties,
        },
      };

      const scriptPath = join(__dirname, '../track.js');
      // @ts-ignore
      expect(daemonizeProcess).toHaveBeenCalledWith({
        arguments: [JSON.stringify(expectedTraceData)],
        script: scriptPath,
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
      expect(daemonizeProcess).not.toHaveBeenCalled();
    });

    it('should not call daemonize if runAsync is set to false', () => {
      const trackSpy = jest.spyOn(telemetryLib, 'track');
      const telemetry = new Telemetry({ runAsync: false });
      const testEvent = 'testEvent';
      const testAccountSid = 'ACxxxxxxxxxxxxxx';
      const testProperties = { testKey: 'testValue' };
      process.env.CI = '';

      telemetry.track(testEvent, testAccountSid, testProperties);

      // @ts-ignore
      expect(daemonizeProcess).not.toHaveBeenCalled();
      expect(trackSpy).toHaveBeenCalled();
    });
  });

  describe('getRealm', () => {
    it('should get stage-us1 when region is stage', () => {
      const telemetry = new Telemetry();
      process.env.TWILIO_REGION = 'stage';
      // @ts-ignore
      expect(telemetry.getRealm()).toEqual('stage-us1');
    });

    it('should get dev-us1 when region is dev', () => {
      const telemetry = new Telemetry();
      process.env.TWILIO_REGION = 'dev';
      // @ts-ignore
      expect(telemetry.getRealm()).toEqual('dev-us1');
    });
  });
});
