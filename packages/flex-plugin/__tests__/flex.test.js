import '../dev_assets/flex';

describe('flex', () => {
  let runDefaultMockedFailResponse = false;

  global.Twilio = {
    Flex: {
      runDefault: jest.fn().mockImplementation(() => {
        return runDefaultMockedFailResponse
          ? Promise.reject()
          : Promise.resolve();
      }),
    },
  };

  beforeEach(() => {
    global.appConfig = {};
  });

  afterAll(() => delete global.Twilio);

  it('should define a loadFlex to the global scope', () => {
    expect(global.loadFlex).toBeDefined();
  });

  it('should log an error if an `appConfig` object is not available', () => {
    // Arrange
    spyOn(console, 'error');

    // Act
    loadFlex();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR: You must have a valid appConfig with both accountSid and serviceBaseUrl set.'
    );
  });

  it('should log an error if an `appConfig` object is missing an accountSid', () => {
    // Arrange
    global.appConfig = {};
    spyOn(console, 'error');

    // Act
    loadFlex();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR: You must have a valid appConfig with both accountSid and serviceBaseUrl set.'
    );
  });

  it('should log an error if an `appConfig` object is missing a serviceBaseUrl', () => {
    // Arrange
    spyOn(console, 'error');
    global.appConfig = {
      sso: {
        accountSid: 'testAccountSid',
      },
    };

    // Act
    loadFlex();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR: You must have a valid appConfig with both accountSid and serviceBaseUrl set.'
    );
  });

  it('should invoke `Twilio.Flex.runDefault`', () => {
    // Arrange
    spyOn(console, 'error');
    runDefaultMockedFailResponse = false;
    const mockAppConfig = {
      sso: {
        accountSid: 'testAccountSid',
      },
      serviceBaseUrl: 'testUrl',
    };
    global.appConfig = mockAppConfig;

    // Act
    loadFlex();

    // Assert
    expect(console.error).not.toHaveBeenCalled();
    expect(Twilio.Flex.runDefault).toHaveBeenCalledWith(
      mockAppConfig,
      undefined
    );
  });

  it('should render Twilio Flex inside a custom DOM element', () => {
    // Arrange
    runDefaultMockedFailResponse = false;
    const mockAppConfig = {
      sso: {
        accountSid: 'testAccountSid',
      },
      serviceBaseUrl: 'testUrl',
    };
    global.appConfig = mockAppConfig;
    const targetEl = '#testContainer';

    // Act
    loadFlex(targetEl);

    // Assert
    expect(Twilio.Flex.runDefault).toHaveBeenCalledWith(
      mockAppConfig,
      targetEl
    );
  });
});
