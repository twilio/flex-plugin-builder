/// <reference path="../module.d.ts" />

import Flex from '@twilio/flex-ui';

export type FlexGlobal = typeof Flex;

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
  public version: string = __FBP_PLUGIN_VERSION;
  public dependencies: object = {
    'flex-plugin-scripts': __FPB_FLEX_PLUGIN_SCRIPTS_VERSION,
    'flex-plugin': __FPB_FLEX_PLUGIN_VERSION,
    'craco-config-flex-plugin': __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION,
    'flex-ui': __FPB_FLEX_UI_VERSION,
    'react': __FPB_REACT_VERSION,
    'react-dom': __FPB_REACT_DOM_VERSION,
  };

  protected constructor(name: string) {
    this.name = name;

    // tslint:disable-next-line:no-console
    console.log(`loading ${this.name}@${this.version} plugin`);
  }

  public abstract init(flex: FlexGlobal, manager: Flex.Manager): void;
}

export type PluginConstructor<T> = new () => T;

/**
 * Plugin loader helper function
 * @param plugin
 */
export const loadPlugin = <T extends FlexPlugin>(plugin: PluginConstructor<T>) => {
  if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
    Twilio.Flex.Plugins.init(plugin);
  } else {
    // tslint:disable-next-line:no-console
    console.warn('This version of Flex does not appear to support plugins.');
  }
};
