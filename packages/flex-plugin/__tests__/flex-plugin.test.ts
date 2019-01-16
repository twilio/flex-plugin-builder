import {
  FlexPlugin,
  loadPlugin,
  getRuntimeUrl,
  getAssetsUrl
} from "../src/flex-plugin";
import { Flex } from "@twilio/flex-ui/src/FlexGlobal";

declare var console;

describe("@twilio/flex-plugin", () => {
  // Mocking the console object
  console = {
    log: jest.fn(),
    warn: jest.fn()
  };

  const PLUGIN_NAME = `Test Plugin`;

  class TestPlugin extends FlexPlugin {
    constructor() {
      super(PLUGIN_NAME);
    }

    init(flex, manager) {}
  }

  beforeEach(() => jest.clearAllMocks());

  describe("FlexPlugin", () => {
    class TestFlexPlugin extends FlexPlugin {
      constructor(name) {
        super(name);
      }

      init(flex: any, manager: Flex.Manager): void {}
    }

    test("Should accept a name and display a message to the console", () => {
      // Act
      new TestPlugin();

      // Assert
      expect(console.log).toHaveBeenCalledWith(`loading ${PLUGIN_NAME} plugin`);
    });

    test("getName should return the plugin name in a string format", () => {
      // Arrange
      const pluginName: string = "plugin-test";

      // Act
      const flexPlugin: FlexPlugin = new TestFlexPlugin(pluginName);
      const expectedName: string = flexPlugin.name;

      // Assert
      expect(expectedName).toEqual(pluginName);
    });
  });

  describe("loadPlugin", () => {
    test(
      "should log a warning to the console when a `Twilio` namespace is " +
        "not available to the global scope",
      () => {
        // Arrange
        global["Twilio"] = undefined;

        const expectedWarning =
          "This version of Flex does not appear to support plugins.";

        // Act
        loadPlugin(TestPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test(
      "should log a warning to the console when a `Flex` does not exists " +
        "inside the `Twilio` object",
      () => {
        // Arrange
        global["Twilio"] = {};

        const expectedWarning =
          "This version of Flex does not appear to support plugins.";

        // Act
        loadPlugin(TestPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test(
      "should log a warning to the console when `Plugins` does not exists " +
        "inside the `Twilio.Flex` object",
      () => {
        // Arrange
        global["Twilio"] = {
          Flex: {}
        };

        const expectedWarning =
          "This version of Flex does not appear to support plugins.";

        // Act
        loadPlugin(TestPlugin);

        // Assert
        expect(console.warn).toHaveBeenCalledWith(expectedWarning);
      }
    );

    test("should initialize the `Twilio.Flex` plugins", () => {
      // Arrange
      global["Twilio"] = {
        Flex: {
          Plugins: {
            init: jest.fn()
          }
        }
      };

      // Act
      loadPlugin(TestPlugin);

      // Assert
      expect(console.warn).not.toHaveBeenCalled();
      expect(global["Twilio"].Flex.Plugins.init).toHaveBeenCalledWith(TestPlugin);
    });
  });

  describe("getAssetsUrl", () => {
    test("should return a string", () => {
      // Act
      const assetsUrl: string = getAssetsUrl();

      // Assert
      expect(typeof assetsUrl).toEqual("string");
    });

    test("should postfix an `/assets`", () => {
      // Act
      const assetsUrl: string = getAssetsUrl();

      // Assert
      expect(assetsUrl).toMatch(/\/assets$/);
    });
  });
});
