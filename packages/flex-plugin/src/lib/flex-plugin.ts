/// <reference path="../module.d.ts" />

import Flex from '@twilio/flex-ui';

export type FlexGlobal = typeof Flex;

// eslint-disable-next-line import/no-unused-modules
export interface IFlexPlugin {
  name: string;
  init(flex: FlexGlobal, manager: Flex.Manager): void;
}

/**
 * Base class for creating a Flex Plugin
 */
export abstract class FlexPlugin implements IFlexPlugin {
  public name: string;

  public uniqueName: string = __FPB_PLUGIN_UNIQUE_NAME;

  public version: string = __FPB_PLUGIN_VERSION;

  public dependencies: Record<string, string> = {
    'flex-plugin-scripts': __FPB_FLEX_PLUGIN_SCRIPTS_VERSION,
    '@twilio/flex-plugin': __FPB_FLEX_PLUGIN_VERSION,
    'flex-ui': __FPB_FLEX_UI_VERSION,
    react: __FPB_REACT_VERSION,
    'react-dom': __FPB_REACT_DOM_VERSION,
  };

  protected constructor(name: string) {
    this.name = name;

    // eslint-disable-next-line no-console
    console.log(`loading ${this.name}@${this.version} plugin`);
  }

  public abstract init(flex: FlexGlobal, manager: Flex.Manager): void;
}

// eslint-disable-next-line import/no-unused-modules
export type PluginConstructor<T> = new () => T;

/**
 * Plugin loader helper function
 * @param plugin
 */
export const loadPlugin = <T extends FlexPlugin>(plugin: PluginConstructor<T>): void => {
  if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
    Twilio.Flex.Plugins.init(plugin);
  } else {
    // eslint-disable-next-line no-console
    console.warn('This version of Flex does not appear to support plugins.');
  }
};
