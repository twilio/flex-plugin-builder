#!/usr/bin/env node
export { PluginsConfig, PLUGIN_INPUT_PARSER_REGEX } from '@twilio/flex-plugin-webpack';
declare const spawnScript: (...argv: string[]) => Promise<void>;
/**
 * Sets the environment variables from the argv command line
 * @param argv
 */
export declare const setEnvironment: (...argv: string[]) => void;
export default spawnScript;
