declare global {
  interface Twilio {
    Flex: {
      Plugins: {
        init(FlexPlugin);
      };
    };
  }

  interface Window {
    appConfig?: Record<string, unknown>;
    Twilio: Twilio;
  }
}

declare const __FPB_PLUGIN_UNIQUE_NAME: string;
declare const __FPB_PLUGIN_VERSION: string;
declare const __FPB_FLEX_PLUGIN_SCRIPTS_VERSION: string;
declare const __FPB_FLEX_PLUGIN_VERSION: string;
declare const __FPB_FLEX_UI_VERSION: string;
declare const __FPB_REACT_VERSION: string;
declare const __FPB_REACT_DOM_VERSION: string;
