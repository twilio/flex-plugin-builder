import { TwilioError } from '@twilio/flex-plugins-utils-exception';

import * as env from '../env';

describe('env', () => {
  const OLD_ENV = process.env;
  const manager = {
    configuration: {
      logLevel: '',
    },
  };

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;

    manager.configuration.logLevel = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Twilio = {
      Flex: {
        Manager: {
          getInstance: () => manager,
        },
      },
    };

    jest.restoreAllMocks();
  });

  describe('setProcessEnv', () => {
    it('should set the env', () => {
      expect(process.env.foo).toBeUndefined();
      env.setProcessEnv('foo', 'value');
      expect(process.env.foo).toEqual('value');
      env.setProcessEnv('foo', 'new-value');
      expect(process.env.foo).toEqual('new-value');
    });

    it('should not set the env if not node', () => {
      expect(process.env.foo).toBeUndefined();
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      env.setProcessEnv('foo', 'value');
      expect(process.env.foo).toBeUndefined();
    });
  });

  describe('getProcessEnv', () => {
    it('should get the value if set', () => {
      process.env.foo = 'the-value';
      expect(env.getProcessEnv('foo')).toEqual('the-value');
    });

    it('should return undefined if value not set', () => {
      expect(env.getProcessEnv('foo')).toBeUndefined();
    });
  });

  describe('setTwilioProfile', () => {
    const profile = 'the-profile';

    it('should set the profile', () => {
      delete process.env.TWILIO_PROFILE;
      env.setTwilioProfile(profile);

      expect(process.env.TWILIO_PROFILE).toEqual(profile);
    });

    it('should not set the profile env if not node', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      delete process.env.TWILIO_PROFILE;
      env.setTwilioProfile(profile);

      expect(process.env.TWILIO_PROFILE).toBeUndefined();
    });
  });

  describe('getTwilioProfile', () => {
    it('should get the profile', () => {
      process.env.TWILIO_PROFILE = 'profile-name';
      const profile = env.getTwilioProfile();

      expect(profile).toEqual('profile-name');
    });

    it('should return undefined if no profile found', () => {
      delete process.env.TWILIO_PROFILE;
      const profile = env.getTwilioProfile();

      expect(profile).toBeUndefined();
    });
  });

  describe('persistTerminal', () => {
    it('should set the terminal to persist', () => {
      delete process.env.PERSIST_TERMINAL;
      env.persistTerminal();

      expect(process.env.PERSIST_TERMINAL).toEqual('true');
    });

    it('should not set env if not node', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      delete process.env.PERSIST_TERMINAL;
      env.persistTerminal();

      expect(process.env.PERSIST_TERMINAL).toBeUndefined();
    });
  });

  describe('isTerminalPersisted', () => {
    it('isTerminalPersisted should return true', () => {
      process.env.PERSIST_TERMINAL = 'true';
      expect(env.isTerminalPersisted()).toEqual(true);
    });

    it('isTerminalPersisted should return false', () => {
      expect(env.isTerminalPersisted()).toEqual(false);
    });
  });

  describe('debug', () => {
    it('should set debug mode to true', () => {
      delete process.env.DEBUG;
      env.setDebug(true);

      expect(process.env.DEBUG).toEqual('true');
    });

    it('should set debug mode to false', () => {
      delete process.env.DEBUG;
      env.setDebug(false);

      expect(process.env.DEBUG).toEqual('false');
    });

    it('should set debug mode to default', () => {
      delete process.env.DEBUG;
      env.setDebug();

      expect(process.env.DEBUG).toEqual('true');
    });

    it('should not set debug if not node', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      delete process.env.DEBUG;
      env.setDebug(true);

      expect(process.env.DEBUG).toBeUndefined();
    });

    it('debug should return true', () => {
      process.env.DEBUG = 'true';
      expect(env.isDebug()).toEqual(true);
    });

    it('should return with trace true', () => {
      process.env.TRACE = 'true';
      expect(env.isDebug()).toEqual(true);
    });

    it('debug should return false', () => {
      expect(env.isDebug()).toEqual(false);
    });

    it('should return true because twilio config is set', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      manager.configuration.logLevel = 'debug';

      expect(env.isDebug()).toEqual(true);
    });

    it('should return false because twilio config is set', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      manager.configuration.logLevel = 'info';

      expect(env.isDebug()).toEqual(false);
    });

    it('should return false because no twilio env is st', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).Twilio;

      expect(env.isDebug()).toEqual(false);
    });
  });

  describe('trace', () => {
    it('trace should return true', () => {
      process.env.TRACE = 'true';
      expect(env.isTrace()).toEqual(true);
    });

    it('trace should return false', () => {
      expect(env.isTrace()).toEqual(false);
    });

    it('should return true because twilio config is set', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      manager.configuration.logLevel = 'trace';

      expect(env.isTrace()).toEqual(true);
    });

    it('should return false because twilio config is set', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      manager.configuration.logLevel = 'info';

      expect(env.isTrace()).toEqual(false);
    });

    it('should return false because no twilio env is st', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).Twilio;

      expect(env.isTrace()).toEqual(false);
    });
  });

  describe('skipPreflightCheck', () => {
    it('skipPreflightCheck should return true', () => {
      process.env.SKIP_PREFLIGHT_CHECK = 'true';
      expect(env.skipPreflightCheck()).toEqual(true);
    });

    it('skipPreflightCheck should return false', () => {
      expect(env.skipPreflightCheck()).toEqual(false);
    });
  });

  describe('quiet', () => {
    it('isQuiet should return true', () => {
      process.env.QUIET = 'true';
      expect(env.isQuiet()).toEqual(true);
    });

    it('isQuiet should return false', () => {
      expect(env.isQuiet()).toEqual(false);
    });

    it('should set quiet', () => {
      expect(env.isQuiet()).toEqual(false);
      env.setQuiet();
      expect(env.isQuiet()).toEqual(true);
      env.setQuiet(false);
      expect(env.isQuiet()).toEqual(false);
      env.setQuiet(true);
      expect(env.isQuiet()).toEqual(true);
    });
  });

  describe('getRegion', () => {
    it('should return region', () => {
      process.env.TWILIO_REGION = 'stage';

      expect(env.getRegion()).toEqual('stage');
    });
  });

  describe('setRegion', () => {
    it('should set region', () => {
      expect(env.getRegion()).toBeUndefined();
      env.setRegion('stage');
      expect(env.getRegion()).toEqual('stage');
    });
  });

  describe('CLI', () => {
    it('should return true', () => {
      process.env.FLEX_PLUGINS_CLI = 'true';

      expect(env.isCLI()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isCLI()).toEqual(false);
    });

    it('should set CLI', () => {
      expect(env.isCLI()).toEqual(false);
      env.setCLI();
      expect(env.isCLI()).toEqual(true);
    });
  });

  describe('accountSid', () => {
    it('should return accountSid', () => {
      process.env.TWILIO_ACCOUNT_SID = 'AC00000000000000000000000000000000';
      expect(env.getAccountSid()).toEqual('AC00000000000000000000000000000000');
    });

    it('getAccountSid should return nothing', () => {
      expect(env.getAccountSid()).toEqual(undefined);
    });
  });

  describe('authToken', () => {
    it('should return authToken', () => {
      process.env.TWILIO_AUTH_TOKEN = 'abc123';
      expect(env.getAuthToken()).toEqual('abc123');
    });

    it('getAuthToken should return nothing', () => {
      expect(env.getAuthToken()).toEqual(undefined);
    });
  });

  describe('host', () => {
    it('should return host', () => {
      process.env.HOST = '1.2.3.4';
      expect(env.getHost()).toEqual('1.2.3.4');
    });

    it('getHost should return nothing', () => {
      expect(env.getHost()).toEqual(undefined);
    });

    it('should set host', () => {
      expect(env.getHost()).toEqual(undefined);
      env.setHost('1.2.3.4.5');
      expect(env.getHost()).toEqual('1.2.3.4.5');
    });
  });

  describe('port', () => {
    it('should return port', () => {
      process.env.PORT = '1234';
      expect(env.getPort()).toEqual(1234);
      expect(env.hasPort()).toEqual(true);
    });

    it('should check hasPort', () => {
      expect(env.hasPort()).toEqual(false);
    });

    it('should set port', () => {
      env.setPort(123);
      expect(env.getPort()).toEqual(123);
    });
  });

  describe('httpProxy', () => {
    it('should return httpProxy', () => {
      process.env.HTTP_PROXY = '1234';
      expect(env.getHttpProxy()).toEqual('1234');
      expect(env.hasHttpProxy()).toEqual(true);
    });

    it('should check httpProxy', () => {
      expect(env.hasHttpProxy()).toEqual(false);
    });

    it('should set httpProxy', () => {
      env.setHttpProxy('123');
      expect(env.getHttpProxy()).toEqual('123');
    });
  });

  describe('flexUISrc', () => {
    const localFlexUISrc = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';

    it('should return local flexUISrc', () => {
      process.env.FLEX_UI_SRC = localFlexUISrc;
      expect(env.getFlexUISrc()).toEqual(localFlexUISrc);
    });

    it('should set local flexUISrc', () => {
      env.setFlexUISrc(localFlexUISrc);
      expect(env.getFlexUISrc()).toEqual(localFlexUISrc);
    });

    it('should error if invalid flexUISrc', () => {
      try {
        env.setFlexUISrc('invalid-flex-ui-source');
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioError);
        expect(e.message).toContain('is not a valid JS file');
        expect(env.getFlexUISrc()).toBeUndefined();
      }
    });
  });

  describe('nodeEnv', () => {
    it('should return node env', () => {
      process.env.NODE_ENV = 'test';
      expect(env.getNodeEnv()).toEqual('test');
    });

    it('should set node env', () => {
      env.setNodeEnv(env.Environment.Development);
      expect(env.getNodeEnv()).toEqual(env.Environment.Development);
    });
  });

  describe('babelEnv', () => {
    it('should return babel env', () => {
      process.env.BABEL_ENV = 'test';
      expect(env.getBabelEnv()).toEqual('test');
    });

    it('getBabelEnv should return nothing', () => {
      expect(env.getBabelEnv()).toEqual(undefined);
    });

    it('should set babel env', () => {
      expect(env.getBabelEnv()).toEqual(undefined);
      env.setBabelEnv(env.Environment.Development);
      expect(env.getBabelEnv()).toEqual(env.Environment.Development);
    });
  });

  describe('lifeCycle', () => {
    it('should return babel env', () => {
      // eslint-disable-next-line camelcase
      process.env.npm_lifecycle_event = env.Lifecycle.Test;
      expect(env.getLifecycle()).toEqual(env.Lifecycle.Test);
    });

    it('should return true for correct lifecycle', () => {
      // eslint-disable-next-line camelcase
      process.env.npm_lifecycle_event = env.Lifecycle.Build;
      expect(env.isLifecycle(env.Lifecycle.Build)).toEqual(true);
    });

    it('should return false for lifecycle', () => {
      expect(env.isLifecycle(env.Lifecycle.Build)).toEqual(false);
    });
  });

  describe('https', () => {
    it('should return true', () => {
      process.env.HTTPS = 'true';
      expect(env.isHTTPS()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isHTTPS()).toEqual(false);
    });
  });

  describe('SocketHost', () => {
    it('should set socket host', () => {
      expect(env.getWDSSocketHost()).toEqual(undefined);
      env.setWDSSocketHost('1.2.3.4.5');
      expect(env.getWDSSocketHost()).toEqual('1.2.3.4.5');
    });

    it('getWDSSocketHost should return nothing', () => {
      expect(env.getWDSSocketHost()).toEqual(undefined);
    });

    it('should return host', () => {
      process.env.WDS_SOCKET_HOST = '1.2.3.4.5';
      expect(env.getWDSSocketHost()).toEqual('1.2.3.4.5');
    });
  });

  describe('WDSSocketPath', () => {
    it('should set socket path', () => {
      expect(env.getWDSSocketPath()).toEqual(undefined);
      env.setWDSSocketPath('/the-path');
      expect(env.getWDSSocketPath()).toEqual('/the-path');
    });

    it('should return nothing', () => {
      expect(env.getWDSSocketPath()).toEqual(undefined);
    });

    it('should return path', () => {
      process.env.WDS_SOCKET_PATH = '/the-path';
      expect(env.getWDSSocketPath()).toEqual('/the-path');
    });
  });

  describe('WDSSocketPort', () => {
    it('should set socket port', () => {
      expect(env.getWDSSocketPort()).toEqual(NaN);
      env.setWDSSocketPort(4000);
      expect(env.getWDSSocketPort()).toEqual(4000);
    });

    it('should return nothing', () => {
      expect(env.getWDSSocketPort()).toEqual(NaN);
    });

    it('should return port', () => {
      process.env.WDS_SOCKET_PORT = '4000';
      expect(env.getWDSSocketPort()).toEqual(4000);
    });
  });
});
