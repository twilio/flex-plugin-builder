import env, { Environment, Lifecycle } from '../env';

describe('env', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  describe('terminalPersisted', () => {
    it('should return true', () => {
      process.env.PERSIST_TERMINAL = 'true';
      expect(env.isTerminalPersisted()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isTerminalPersisted()).toEqual(false);
    })
  });

  describe('CI', () => {
    it('should return true', () => {
      process.env.CI = 'true';
      expect(env.isCI()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isCI()).toEqual(false);
    })
  });

  describe('debug', () => {
    it('should return true', () => {
      process.env.DEBUG = 'true';
      expect(env.isDebug()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isDebug()).toEqual(false);
    })
  });

  describe('verbos', () => {
    it('should return true', () => {
      process.env.TRACE = 'true';
      expect(env.isVerbose()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isVerbose()).toEqual(false);
    })
  });

  describe('accountSid', () => {
    it('should return accountSid', () => {
      process.env.TWILIO_ACCOUNT_SID = 'ACxxx';
      expect(env.getAccountSid()).toEqual('ACxxx');
    });

    it('should return nothing', () => {
      expect(env.getAccountSid()).toEqual(undefined);
    })
  });

  describe('authToken', () => {
    it('should return authToken', () => {
      process.env.TWILIO_AUTH_TOKEN = 'abc123';
      expect(env.getAuthToken()).toEqual('abc123');
    });

    it('should return nothing', () => {
      expect(env.getAuthToken()).toEqual(undefined);
    })
  });

  describe('realm', () => {
    it('should return realm', () => {
      process.env.REALM = 'dev';
      expect(env.getRealm()).toEqual('dev');
    });

    it('should return nothing', () => {
      expect(env.getRealm()).toEqual(undefined);
    })
  });

  describe('host', () => {
    it('should return host', () => {
      process.env.HOST = '1.2.3.4';
      expect(env.getHost()).toEqual('1.2.3.4');
    });

    it('should return nothing', () => {
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

  describe('nodeEnv', () => {
    it('should return node env', () => {
      process.env.NODE_ENV = 'test';
      expect(env.getNodeEnv()).toEqual('test');
    });

    it('should set node env', () => {
      env.setNodeEnv(Environment.Development);
      expect(env.getNodeEnv()).toEqual(Environment.Development);
    });
  });

  describe('babelEnv', () => {
    it('should return babel env', () => {
      process.env.BABEL_ENV = 'test';
      expect(env.getBabelEnv()).toEqual('test');
    });

    it('should return nothing', () => {
      expect(env.getBabelEnv()).toEqual(undefined);
    });

    it('should set babel env', () => {
      expect(env.getBabelEnv()).toEqual(undefined);
      env.setBabelEnv(Environment.Development);
      expect(env.getBabelEnv()).toEqual(Environment.Development);
    });
  });

  describe('lifeCycle', () => {
    it('should return babel env', () => {
      process.env.npm_lifecycle_event = Lifecycle.Test;
      expect(env.getLifecycle()).toEqual(Lifecycle.Test);
    });

    it('should return true for correct lifecycle', () => {
      process.env.npm_lifecycle_event = Lifecycle.Build;
      expect(env.isLifecycle(Lifecycle.Build)).toEqual(true);
    });

    it('should return false for lifecycle', () => {
      expect(env.isLifecycle(Lifecycle.Build)).toEqual(false);
    });
  });

  describe('https', () => {
    it('should return true', () => {
      process.env.HTTPS = 'true';
      expect(env.isHTTPS()).toEqual(true);
    });

    it('should return false', () => {
      expect(env.isHTTPS()).toEqual(false);
    })
  });
});
