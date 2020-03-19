import { Flex } from '@twilio/flex-ui/src/FlexGlobal';
import { version } from 'punycode';
import { FlexGlobal, FlexPlugin, loadPlugin } from '../flex-plugin';

declare var console: Partial<Console>;

describe('@twilio/flex-plugin', () => {
    // Mocking the console object
    console = {
        log: jest.fn(),
        warn: jest.fn(),
    };

    const PLUGIN_NAME = 'Test Plugin';
    const PLUGIN_VERSION = '1.0.0';
    const IDENTIFIER = 'plugin-identifier';
    const FLEX_PLUGIN_SCRIPTS_VERSION = '2.0.0';
    const FLEX_PLUGIN_VERSION = '2.1.0';
    const CRACO_CONFIG_VERSION = '2.2.0';
    const FLEX_UI_VERSION = '2.3.0';
    const REACT_VERSION = '2.4.0';
    const REACT_DOM_VERSION = '2.5.0';
    // @ts-ignore
    globalThis.__FPB_PLUGIN_IDENTIFIER = IDENTIFIER;
    // @ts-ignore
    globalThis.__FBP_PLUGIN_VERSION = PLUGIN_VERSION;
    // @ts-ignore
    globalThis.__FPB_FLEX_PLUGIN_SCRIPTS_VERSION = FLEX_PLUGIN_SCRIPTS_VERSION;
    // @ts-ignore
    globalThis.__FPB_FLEX_PLUGIN_VERSION = FLEX_PLUGIN_VERSION;
    // @ts-ignore
    globalThis.__FPB_CRACO_CONFIG_FLEX_PLUGIN = CRACO_CONFIG_VERSION;
    // @ts-ignore
    globalThis.__FPB_FLEX_UI_VERSION = FLEX_UI_VERSION;
    // @ts-ignore
    globalThis.__FPB_REACT_VERSION = REACT_VERSION;
    // @ts-ignore
    globalThis.__FPB_REACT_DOM_VERSION = REACT_DOM_VERSION;

    class TestPlugin extends FlexPlugin {
        constructor() {
            super(PLUGIN_NAME);
        }

        public init(flex: FlexGlobal, manager: Flex.Manager) {
            // no-op
        }
    }

    beforeEach(() => jest.clearAllMocks());

    describe('FlexPlugin', () => {
        // tslint:disable-next-line:max-classes-per-file
        class TestFlexPlugin extends FlexPlugin {
            constructor(name: string) {
                super(name);
            }

            public init(flex: any, manager: Flex.Manager): void {
                // no-op
            }
        }

        it('should test injected properties', () => {
            const plugin = new TestPlugin();

            expect(plugin.name).toEqual(PLUGIN_NAME);
            expect(plugin.version).toEqual(PLUGIN_VERSION);
            expect(plugin.identifier).toEqual(IDENTIFIER);
            expect(plugin.dependencies['flex-plugin-scripts']).toEqual(FLEX_PLUGIN_SCRIPTS_VERSION);
            expect(plugin.dependencies['flex-plugin']).toEqual(FLEX_PLUGIN_VERSION);
            expect(plugin.dependencies['craco-config-flex-plugin']).toEqual(CRACO_CONFIG_VERSION);
            expect(plugin.dependencies['flex-ui']).toEqual(FLEX_UI_VERSION);
            expect(plugin.dependencies.react).toEqual(REACT_VERSION);
            expect(plugin.dependencies['react-dom']).toEqual(REACT_DOM_VERSION);
        });

        it('Should accept a name and display a message to the console', () => {
            // tslint:disable-next-line:no-unused-expression
            new TestPlugin();

            // tslint:disable-next-line:no-console
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
        it('should log a warning when `Twilio` namespace is not available', () => {
            // tslint:disable-next-line:no-string-literal
            global['Twilio'] = undefined;
            loadPlugin(TestPlugin);

            // tslint:disable-next-line:no-console
            expect(console.warn)
                .toHaveBeenCalledWith( 'This version of Flex does not appear to support plugins.');
        });

        it('should log a warning when `Flex` does not exists in Twilio object', () => {
            // tslint:disable-next-line:no-string-literal
            global['Twilio'] = {};
            loadPlugin(TestPlugin);

            // tslint:disable-next-line:no-console
            expect(console.warn)
                .toHaveBeenCalledWith('This version of Flex does not appear to support plugins.');
        });

        it('should log a warning `Plugins` does not exists in `Twilio.Flex`', () => {
            // tslint:disable-next-line:no-string-literal
            global['Twilio'] = {
                Flex: {},
            };
            loadPlugin(TestPlugin);

            // tslint:disable-next-line:no-console
            expect(console.warn)
                .toHaveBeenCalledWith( 'This version of Flex does not appear to support plugins.');
        });

        it('should initialize the `Twilio.Flex` plugins', () => {
            // tslint:disable-next-line:no-string-literal
            global['Twilio'] = {
                Flex: {
                    Plugins: {
                        init: jest.fn(),
                    },
                },
            };

            loadPlugin(TestPlugin);

            // tslint:disable-next-line:no-console
            expect(console.warn).not.toHaveBeenCalled();
            // tslint:disable-next-line:no-string-literal
            expect(global['Twilio'].Flex.Plugins.init).toHaveBeenCalledWith(TestPlugin);
        });
    });
});
