/* eslint-disable import/no-unused-modules */
import { ChildProcessWithoutNullStreams, spawn, SpawnOptionsWithoutStdio } from 'child_process';

import { logger } from '@twilio/flex-dev-utils';

import { homeDir, testParams } from '../core';

interface SpawnResult {
  stdout: string;
  stderr: string;
  child?: ChildProcessWithoutNullStreams;
}

/**
 * Logs the output in real time
 */
const logInfo = (data: string | Buffer, level: 'info' | 'warning'): void => {
  data = data.toString().trim();
  if (data) {
    logger[level](`[${new Date().toUTCString()}] -`, data.toString().replace(/-/g, '\\-'));
  }
};

/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 * @param options spawn options to run
 */
export const promisifiedSpawn = async (
  cmd: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
): Promise<SpawnResult> => {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      cwd: homeDir,
      env: {
        PATH: `${testParams.environment.path}:/${homeDir}/bin`,
        TWILIO_ACCOUNT_SID: testParams.secrets.api.accountSid,
        TWILIO_AUTH_TOKEN: testParams.secrets.api.authToken,
        TWILIO_REGION: testParams.config.region,
        NODE_OPTIONS: testParams.environment.nodeOptions,
      },
      shell: true,
    };
    const spawnOptions = { ...defaultOptions, ...options };
    logger.info(`Running spawn command: **${cmd} ${args.join(' ').replace(/-/g, '\\-')}**`);
    logger.debug(`Spawn options are **${JSON.stringify(spawnOptions)}**`);

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
      logInfo(data, 'warning');

      if (typeof data === 'string') {
        stderrArr.push(Buffer.from(data, 'utf-8'));
      } else {
        stderrArr.push(data);
      }
    });

    // data
    child.stdout.on('data', (data) => {
      logInfo(data, 'info');

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

    if (options?.detached) {
      return resolve({
        stdout: Buffer.concat(stdoutArr).toString(),
        stderr: Buffer.concat(stderrArr).toString(),
        child,
      });
    }
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

/**
 * Kills child process
 * @param child child process to kill
 * @param os operating system
 */
export const killChildProcess = async (
  child: ChildProcessWithoutNullStreams | undefined,
  os: string,
  retry = 2,
): Promise<void> => {
  if (!child) {
    throw new Error('Could not kill child process, process does not exist');
  }

  if (os === 'win32') {
    try {
      if (retry !== 2) {
        logger.error(`Checking current status of process ${child.pid}`);
        await promisifiedSpawn('tasklist', ['/v', '/fi', `"PID eq ${child.pid}"`]);
      }
      await promisifiedSpawn('taskkill', ['/pid', `${child.pid}`, '/f', '/t']);
    } catch (e) {
      logger.error(`Error killing the process: ${e}}`);
      if (retry > 0) {
        logger.info('Retrying to kill the process');
        await killChildProcess(child, os, retry - 1);
      }
    }
  } else {
    child.kill();
  }
};

export const retryOnError = async (
  method: (first: boolean) => Promise<unknown>,
  onError: (e: any) => Promise<unknown>,
  onFinally: () => Promise<unknown>,
  maxRetries: number,
): Promise<void> => {
  let attempts = 1;
  while (attempts <= maxRetries) {
    try {
      await method(attempts === 1); // Attempt the main operation
      break; // If operation succeeds, exit the loop
    } catch (error) {
      logger.info('Error occured', error);
      if (attempts === maxRetries) {
        await onError(error); // Handle error if all retries fail
        await onFinally(); // cleanup
        throw new Error(`Operation failed after ${maxRetries} retries`);
      } else {
        logger.info(`Attempt ${attempts} failed. Retrying...`);
        attempts += 1;
      }
    }
  }
  await onFinally(); // cleanup
};
