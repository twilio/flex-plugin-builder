import { Flex } from '@twilio/flex-ui/src/FlexGlobal';
import { FlexGlobal, FlexPlugin, loadPlugin } from './flex-plugin';

declare var console: Partial<Console>;

describe('@twilio/flex-plugin', () => {
    // Mocking the console object
    console = {
        log: jest.fn(),
        warn: jest.fn(),
    };

    const PLUGIN_NAME = `Test Plugin`;

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

        it('Should accept a name and display a message to the console', () => {
            // tslint:disable-next-line:no-unused-expression
            new TestPlugin();

            // tslint:disable-next-line:no-console
            expect(console.log).toHaveBeenCalledWith(`loading ${PLUGIN_NAME} plugin`);
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
