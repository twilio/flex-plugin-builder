import { spawn, SpawnPromise } from 'flex-dev-utils/dist/spawn';

const deployScriptPath = require.resolve('flex-plugin-scripts/dist/scripts/deploy');
const preScriptCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-script-check');

// eslint-disable-next-line import/no-unused-modules
export type DeployOptions = {
  cwd: string;
  name: string;
};

/**
 * Entry point for deploying a JS bundle
 * @param options
 */
// @ts-ignore
export default async function run(options: DeployOptions): SpawnPromise {
  await spawn('node', [preScriptCheck, '--run-script', '--core-cwd', options.cwd, '--cwd', options.cwd]);
  return spawn('node', [deployScriptPath, '--run-script', '--core-cwd', options.cwd, '--name', options.name]);
}
