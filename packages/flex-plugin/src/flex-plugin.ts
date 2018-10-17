import * as Flex from '@twilio/flex-ui';

declare global {
  interface Window {
    serviceBaseUrl?: string;
    appConfig?: {
      serviceBaseUrl?: string;
    }
  }
}

declare const Twilio: {
  Flex: {
    Plugins: {
      init(FlexPlugin)
    }
  }
}

export interface FlexPlugin {
  name: string;
  getName(): string;
  init(flex: any, manager: Flex.ContactCenterManager): any;
}

export class FlexPlugin implements FlexPlugin {
  public name: string;

  constructor(name: string) {
    this.name = name;
    console.log(`loading ${this.name} plugin`);
  }

  public getName() {
    return this.name;
  }
}

export function loadPlugin(plugin: FlexPlugin) {
  if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
    Twilio.Flex.Plugins.init(plugin);
  } else {
    console.warn('This version of Flex does not appear to support plugins.');
  }
}

export function getRuntimeUrl(): string {
  if (window.serviceBaseUrl) {
    return window.serviceBaseUrl;
  }

  if (window.appConfig && window.appConfig.serviceBaseUrl) {
    return window.appConfig.serviceBaseUrl;
  }

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
