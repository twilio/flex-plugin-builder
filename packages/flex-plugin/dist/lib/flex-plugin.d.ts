/// <reference types="src/module" />
import Flex from '@twilio/flex-ui';
export declare type FlexGlobal = typeof Flex;
export interface IFlexPlugin {
    name: string;
    init(flex: FlexGlobal, manager: Flex.Manager): void;
}
/**
 * Base class for creating a Flex Plugin
 */
export declare abstract class FlexPlugin implements IFlexPlugin {
    name: string;
    uniqueName: string;
    version: string;
    dependencies: Record<string, string>;
    protected constructor(name: string);
    abstract init(flex: FlexGlobal, manager: Flex.Manager): void;
}
export declare type PluginConstructor<T> = new () => T;
/**
 * Plugin loader helper function
 * @param plugin
 */
export declare const loadPlugin: <T extends FlexPlugin>(plugin: PluginConstructor<T>) => void;
