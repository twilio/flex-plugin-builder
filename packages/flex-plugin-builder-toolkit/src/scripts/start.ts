import { spawn, SpawnPromise } from 'flex-dev-utils';

const startScriptPath = require.resolve('flex-plugin-scripts/dist/scripts/start');
const preStartCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-start-check');
const preScriptCheck = require.resolve('flex-plugin-scripts/dist/scripts/pre-script-check');

export type StartOptions = {
  cwd: string;
  name: string;
}

// @ts-ignore
export default async function run(options: StartOptions): SpawnPromise {
  await spawn('node', [preStartCheck, '--run-script', '--core-cwd', options.cwd, '--cwd', options.cwd])
  await spawn('node', [preScriptCheck, '--run-script', '--core-cwd', options.cwd, '--cwd', options.cwd])
  return spawn('node', [startScriptPath, '--run-script', '--core-cwd', options.cwd, '--name', options.name])
}
