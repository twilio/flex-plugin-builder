#!/usr/bin/env node
declare const spawnScript: (...argv: string[]) => Promise<void>;
/**
 * Sets the environment variables from the argv command line
 * @param argv
 */
export declare const setEnvironment: (...argv: string[]) => void;
export default spawnScript;
