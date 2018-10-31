import {
  FlexPlugin,
  loadPlugin,
  getRuntimeUrl,
  getAssetsUrl
} from '../src/flex-plugin';

declare var console;

describe('@twilio/flex-plugin', () => {
  // Mocking the console object
  console = {
    log: jest.fn(),
    warn: jest.fn()
  };

  beforeEach(() => jest.clearAllMocks());

  describe('FlexPlugin', () => {
    test('Should accept a name and display a message to the console', () => {
      // Arrange
      const pluginName: string = 'plugin-test';

      // Act
      new FlexPlugin(pluginName);

      // Assert
      expect(console.log).toHaveBeenCalledWith(`loading ${pluginName} plugin`);
    });

    test('getName should return the plugin name in a string format', () => {
      // Arrange
      const pluginName: string = 'plugin-test';

      // Act
      const flexPlugin: FlexPlugin = new FlexPlugin(pluginName);
      const expectedName: string = flexPlugin.getName();

      // Assert
      expect(expectedName).toEqual(pluginName);
    });
  });

  describe('loadPlugin', () => {
    test(
      'should log a warning to the console when a `Twilio` namespace is ' +
        'not available to the global scope',
      () => {
        // Arrange
        global['Twilio'] = undefined;

        const flexPlugin: FlexPlugin = new FlexPlugin('plugin-test');
        const expectedWarning =
          'This version of Flex does not appear to support plugins.';

        // Act
        loadPlugin(flexPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test(
      'should log a warning to the console when a `Flex` does not exists ' +
        'inside the `Twilio` object',
      () => {
        // Arrange
        global['Twilio'] = {};

        const flexPlugin: FlexPlugin = new FlexPlugin('plugin-test');
        const expectedWarning =
          'This version of Flex does not appear to support plugins.';

        // Act
        loadPlugin(flexPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test(
      'should log a warning to the console when `Plugins` does not exists ' +
        'inside the `Twilio.Flex` object',
      () => {
        // Arrange
        global['Twilio'] = {
          Flex: {}
        };

        const flexPlugin: FlexPlugin = new FlexPlugin('plugin-test');
        const expectedWarning =
          'This version of Flex does not appear to support plugins.';

        // Act
        loadPlugin(flexPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test('should initialize the `Twilio.Flex` plugins', () => {
      // Arrange
      global['Twilio'] = {
        Flex: {
          Plugins: {
            init: jest.fn()
          }
        }
      };
      const pluginName: string = 'plugin-test';
      const flexPlugin: FlexPlugin = new FlexPlugin(pluginName);

      // Act
      loadPlugin(flexPlugin);

      // Assert
      expect(console.warn).not.toHaveBeenCalled();
      expect(global['Twilio'].Flex.Plugins.init).toHaveBeenCalledWith({
        name: pluginName
      });
    });
  });

  describe('getRuntimeUrl', () => {
    test('should return a `serviceBaseUrl` when available into the `window` object', () => {
      // Arrange
      window.serviceBaseUrl = 'testServiceBaseUrl';

      // Act
      const expectedGetRuntimeUrl = getRuntimeUrl();

      // Assert
      expect(expectedGetRuntimeUrl).toEqual('testServiceBaseUrl');
    });

    test('should return a `serviceBaseUrl` if available into the `appConfig` object and missing inside the `window` one', () => {
      // Arrange
      const serviceBaseUrl = 'appConfigServiceBaseUrl';
      window.serviceBaseUrl = undefined;
      window.appConfig = { serviceBaseUrl };

      // Act
      const expectedGetRuntimeUrl = getRuntimeUrl();

      // Assert
      expect(expectedGetRuntimeUrl).toEqual(serviceBaseUrl);
    });

    test('should return an empty string otherwise', () => {
      // Arrange
      window.serviceBaseUrl = undefined;
      window.appConfig = { serviceBaseUrl: undefined };

      // Act
      const expectedGetRuntimeUrl = getRuntimeUrl();

      // Assert
      expect(expectedGetRuntimeUrl).toEqual('');
    });
  });

  describe('getAssetsUrl', () => {
    test('should return a string', () => {
      // Act
      const assetsUrl: string = getAssetsUrl();

      // Assert
      expect(typeof assetsUrl).toEqual('string');
    });

    test('should postfix an `/assets`', () => {
      // Act
      const assetsUrl: string = getAssetsUrl();

      // Assert
      expect(assetsUrl).toMatch(/\/assets$/);
    });
  });
});
