import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

import { logger } from 'flex-plugins-utils-logger';

import { homeDir } from '..';

interface SpawnResult {
  stdout: string;
  stderr: string;
}

/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
export default async (cmd: string, args: string[], options?: SpawnOptionsWithoutStdio): Promise<SpawnResult> => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      cwd: homeDir,
      env: {
        PATH: `${process.env.PATH}:/${homeDir}/bin`,
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      },
    };
    const spawnOptions = { ...defaultOptions, ...options };
    logger.info(`Running spawn command: **${cmd} ${args.join(' ').replace(/-/g, '\\-')}**`);
    logger.debug(`Spawn options are **${JSON.stringify(options)}**`);

    const child = spawn(cmd, args, spawnOptions);

    const stdoutArr: Buffer[] = [];
    const stderrArr: Buffer[] = [];

    // errors
    child.on('error', reject);
    child.stdin.on('error', reject);
    child.stdout.on('error', reject);
    child.stderr.setEncoding('utf8');
    child.stderr.on('error', reject);
    child.stderr.on('data', (data) => {
      if (typeof data === 'string') {
        stderrArr.push(Buffer.from(data, 'utf-8'));
      } else {
        stderrArr.push(data);
      }
    });

    // data
    child.stdout.on('data', (data) => {
      if (typeof data === 'string') {
        stdoutArr.push(Buffer.from(data, 'utf-8'));
      } else {
        stdoutArr.push(data);
      }
    });

    child.on('close', (code) => {
      const stdout = Buffer.concat(stdoutArr).toString();
      const stderr = Buffer.concat(stderrArr).toString();

      if (code === 0) {
        return resolve({ stdout, stderr });
      }

      return reject(new Error(`Command exited with code ${code} and message ${stdout}: ${stderr}`));
    });
  });
};

/**
 * Helper for logging the result from a spawn
 * @param result the result to log
 */
export const logResult = (result: SpawnResult): void => {
  logger.info(result.stdout.replace(/-/g, '\\-'));
  if (result.stderr) {
    logger.warning(result.stderr.replace(/-/g, '\\-'));
  }
};
