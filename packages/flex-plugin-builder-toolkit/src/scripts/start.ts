import { spawn, SpawnPromise } from 'flex-dev-utils/dist/spawn';

const startScriptPath = require.resolve('flex-plugin-scripts/dist/scripts/start');
const preStartCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-start-check');
const preScriptCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-script-check');

// eslint-disable-next-line import/no-unused-modules
export type StartOptions = {
  cwd: string;
  name: string;
};

const runScriptFlag = '--run-script';
const coreCwdFlag = '--core-cwd';

/**
 * Entry point for starting a dev-server
 * @param options
 */
// @ts-ignore
export default async function run(options: StartOptions): SpawnPromise {
  await spawn('node', [preStartCheck, runScriptFlag, coreCwdFlag, options.cwd, '--cwd', options.cwd]);
  await spawn('node', [preScriptCheck, runScriptFlag, coreCwdFlag, options.cwd, '--cwd', options.cwd]);
  return spawn('node', [startScriptPath, runScriptFlag, coreCwdFlag, options.cwd, '--name', options.name]);
}
