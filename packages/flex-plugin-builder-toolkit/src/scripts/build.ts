import { spawn, SpawnPromise } from 'flex-dev-utils';

const buildScriptPath = require.resolve('flex-plugin-scripts/dist/scripts/build');
const preScriptCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-script-check');

// eslint-disable-next-line import/no-unused-modules
export type BuildOptions = {
  cwd: string;
  name: string;
};

/**
 * Entry point for building a JS bundle
 * @param options
 */
// @ts-ignore
export default async function run(options: BuildOptions): SpawnPromise {
  await spawn('node', [preScriptCheck, '--run-script', '--core-cwd', options.cwd, '--cwd', options.cwd]);
  return spawn('node', [buildScriptPath, '--run-script', '--core-cwd', options.cwd, '--name', options.name]);
}
