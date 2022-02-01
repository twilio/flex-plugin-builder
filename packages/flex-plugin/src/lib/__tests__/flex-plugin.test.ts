/* eslint-disable max-classes-per-file */
import { Flex } from '@twilio/flex-ui/src/FlexGlobal';

import { FlexGlobal, FlexPlugin, loadPlugin } from '../flex-plugin';

declare let console: Partial<Console>;

describe('@twilio/flex-plugin', () => {
  // Mocking the console object
  console = {
    log: jest.fn(),
    warn: jest.fn(),
  };

  const PLUGIN_NAME = 'Test Plugin';
  const PLUGIN_VERSION = '1.0.0';
  const UNIQUE_NAME = 'plugin-identifier';
  const FLEX_PLUGIN_SCRIPTS_VERSION = '2.0.0';
  const FLEX_PLUGIN_VERSION = '2.1.0';
  const FLEX_UI_VERSION = '2.3.0';
  const REACT_VERSION = '2.4.0';
  const REACT_DOM_VERSION = '2.5.0';
  // @ts-ignore
  global.__FPB_PLUGIN_UNIQUE_NAME = UNIQUE_NAME;
  // @ts-ignore
  global.__FPB_PLUGIN_VERSION = PLUGIN_VERSION;
  // @ts-ignore
  global.__FPB_FLEX_PLUGIN_SCRIPTS_VERSION = FLEX_PLUGIN_SCRIPTS_VERSION;
  // @ts-ignore
  global.__FPB_FLEX_PLUGIN_VERSION = FLEX_PLUGIN_VERSION;
  // @ts-ignore
  global.__FPB_FLEX_UI_VERSION = FLEX_UI_VERSION;
  // @ts-ignore
  global.__FPB_REACT_VERSION = REACT_VERSION;
  // @ts-ignore
  global.__FPB_REACT_DOM_VERSION = REACT_DOM_VERSION;

  class TestPlugin extends FlexPlugin {
    constructor() {
      super(PLUGIN_NAME);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public init(flex: FlexGlobal, manager: Flex.Manager) {
      // no-op
    }
  }

  beforeEach(() => jest.clearAllMocks());

  describe('FlexPlugin', () => {
    class TestFlexPlugin extends FlexPlugin {
      // eslint-disable-next-line @typescript-eslint/no-useless-constructor
      constructor(name: string) {
        super(name);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public init(flex: FlexGlobal, manager: Flex.Manager): void {
        // no-op
      }
    }

    it('should test injected properties', () => {
      const plugin = new TestPlugin();

      expect(plugin.name).toEqual(PLUGIN_NAME);
      expect(plugin.version).toEqual(PLUGIN_VERSION);
      expect(plugin.uniqueName).toEqual(UNIQUE_NAME);
      expect(plugin.dependencies['flex-plugin-scripts']).toEqual(FLEX_PLUGIN_SCRIPTS_VERSION);
      expect(plugin.dependencies['@twilio/flex-plugin']).toEqual(FLEX_PLUGIN_VERSION);
      expect(plugin.dependencies['flex-ui']).toEqual(FLEX_UI_VERSION);
      expect(plugin.dependencies.react).toEqual(REACT_VERSION);
      expect(plugin.dependencies['react-dom']).toEqual(REACT_DOM_VERSION);
    });

    it('Should accept a name and display a message to the console', () => {
      // eslint-disable-next-line no-new
      new TestPlugin();

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(`loading ${PLUGIN_NAME}@${PLUGIN_VERSION} plugin`);
    });

    it('getName should return the plugin name in a string format', () => {
      const pluginName: string = 'plugin-test';
      const flexPlugin: FlexPlugin = new TestFlexPlugin(pluginName);
      const expectedName: string = flexPlugin.name;

      expect(expectedName).toEqual(pluginName);
    });
  });

  describe('loadPlugin', () => {
    const warnMsg = 'This version of Flex does not appear to support plugins.';

    it('should log a warning when `Twilio` namespace is not available', () => {
      // @ts-ignore
      global.Twilio = undefined;
      loadPlugin(TestPlugin);

      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith(warnMsg);
    });

    it('should log a warning when `Flex` does not exists in Twilio object', () => {
      // @ts-ignore
      global.Twilio = {};
      loadPlugin(TestPlugin);

      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith(warnMsg);
    });

    it('should log a warning `Plugins` does not exists in `Twilio.Flex`', () => {
      // @ts-ignore
      global.Twilio = {
        Flex: {},
      };
      loadPlugin(TestPlugin);

      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith(warnMsg);
    });

    it('should initialize the `Twilio.Flex` plugins', () => {
      // @ts-ignore
      global.Twilio = {
        Flex: {
          Plugins: {
            init: jest.fn(),
          },
        },
      };

      loadPlugin(TestPlugin);

      // eslint-disable-next-line no-console
      expect(console.warn).not.toHaveBeenCalled();
      // @ts-ignore
      expect(global.Twilio.Flex.Plugins.init).toHaveBeenCalledWith(TestPlugin);
    });
  });
});
