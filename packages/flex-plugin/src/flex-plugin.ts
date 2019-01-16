import * as Flex from '@twilio/flex-ui';

type FlexGlobal = typeof Flex;

declare global {
  interface Window {
    appConfig?: {}
  }
}

declare const Twilio: {
  Flex: {
    Plugins: {
      init(FlexPlugin)
    }
  }
}

export interface IFlexPlugin {
  name: string;
  init(flex: FlexGlobal, manager: Flex.Manager): void;
}

export interface PluginConstructor<T> {
  new (): T;
}

export abstract class FlexPlugin implements IFlexPlugin {
  public name: string;

  constructor(name: string) {
    this.name = name;
    console.log(`loading ${this.name} plugin`);
  }

  abstract init(flex: FlexGlobal, manager: Flex.Manager): void;
}

export function loadPlugin<T extends FlexPlugin>(plugin: PluginConstructor<T>) {
  if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
    Twilio.Flex.Plugins.init(plugin);
  } else {
    console.warn('This version of Flex does not appear to support plugins.');
  }
}

export function getRuntimeUrl(): string {
  if (document && document.currentScript) {
    const pluginScript = document.currentScript;

    if (typeof pluginScript['src'] === 'string') {
      const pluginUrl = (pluginScript as HTMLScriptElement).src;
      return pluginUrl.substr(0, pluginUrl.lastIndexOf('/'));
    }
  }

  return '';
}

export function getAssetsUrl(): string {
  return `${getRuntimeUrl()}/assets`;
}
