import { spawn } from 'child_process';

import { logger } from 'flex-plugins-utils-logger';

interface SpawnResult {
  stdout: string;
  stderr: string;
}

/**
 * Promisified spawn
 * @param cmd the command to spawn
 * @param args the args to that command
 */
export default async (cmd: string, ...args: string[]): Promise<SpawnResult> => {
  return new Promise((resolve, reject) => {
    logger.info(`Running spawn command: **${cmd} ${args.join(' ')}**`);
    const process = spawn(cmd, args);

    const stdoutArr: Buffer[] = [];
    const stderrArr: Buffer[] = [];

    // errors
    process.on('error', reject);
    process.stdin.on('error', reject);
    process.stdout.on('error', reject);
    process.stderr.setEncoding('utf8');
    process.stderr.on('error', reject);
    process.stderr.on('data', (data) => {
      if (typeof data === 'string') {
        stderrArr.push(Buffer.from(data, 'utf-8'));
      } else {
        stderrArr.push(data);
      }
    });

    // data
    process.stdout.on('data', (data) => {
      if (typeof data === 'string') {
        stdoutArr.push(Buffer.from(data, 'utf-8'));
      } else {
        stdoutArr.push(data);
      }
    });

    process.on('close', (code) => {
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
  logger.info(result.stdout);
  if (result.stderr) {
    logger.warning(result.stderr);
  }
};
