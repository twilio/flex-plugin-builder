import * as Flex from '@twilio/flex-ui';
type FlexGlobal = typeof Flex;

export interface IFlexPlugin {
  name: string;
  init(flex: FlexGlobal, manager: Flex.Manager): void;
}

/**
 * Base class for creating a Flex Plugin
 */
export abstract class FlexPlugin implements IFlexPlugin {
  public name: string;

  protected constructor(name: string) {
    this.name = name;
    console.log(`loading ${this.name} plugin`);
  }

  abstract init(flex: FlexGlobal, manager: Flex.Manager): void;
}

export interface PluginConstructor<T> {
  new (): T;
}

/**
 * Plugin loader helper function
 * @param plugin
 */
export const loadPlugin = <T extends FlexPlugin>(plugin: PluginConstructor<T>) => {
  if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
    Twilio.Flex.Plugins.init(plugin);
  } else {
    console.warn('This version of Flex does not appear to support plugins.');
  }
};
