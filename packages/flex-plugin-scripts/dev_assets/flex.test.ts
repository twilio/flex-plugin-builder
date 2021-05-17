import './flex';

declare const global: any;
declare const loadFlex: (arg?: any) => void;

describe('flex', () => {
  let runDefaultMockedFailResponse = false;

  const Twilio = {
    Flex: {
      runDefault: jest.fn().mockImplementation(() => {
        return runDefaultMockedFailResponse ? Promise.reject() : Promise.resolve();
      }),
    },
  };

  global.Twilio = Twilio;

  beforeEach(() => {
    global.appConfig = {};
  });

  afterAll(() => delete global.Twilio);

  it('should define a loadFlex to the global scope', () => {
    expect(global.loadFlex).toBeDefined();
  });

  it('should invoke `Twilio.Flex.runDefault`', () => {
    // Arrange
    spyOn(console, 'error');
    runDefaultMockedFailResponse = false;
    const mockAppConfig = {
      sso: {
        accountSid: 'testAccountSid',
      },
    };
    global.appConfig = mockAppConfig;

    loadFlex();

    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled();
    expect(Twilio.Flex.runDefault).toHaveBeenCalledWith(mockAppConfig, undefined);
  });

  it('should render Twilio Flex inside a custom DOM element', () => {
    runDefaultMockedFailResponse = false;
    const mockAppConfig = {
      sso: {
        accountSid: 'testAccountSid',
      },
    };
    global.appConfig = mockAppConfig;
    const targetEl = '#testContainer';

    loadFlex(targetEl);

    expect(Twilio.Flex.runDefault).toHaveBeenCalledWith(mockAppConfig, targetEl);
  });
});
