import {sync as spawnSync} from 'cross-spawn';

import * as logger from './logger';

const spawn = (processArgs: string[]): number => {
  const child = spawnSync("node", processArgs, { stdio: "inherit" });

  if (child.signal) {
    if (child.signal === "SIGKILL") {
      logger.error(`
        The build failed because the process exited too early.
        This probably means the system ran out of memory or someone called
        \`kill -9\` on the process.
      `);
    } else if (child.signal === "SIGTERM") {
      logger.warning(`
        Someone might have called  \`kill\` or \`killall\`, or the system could
        The build failed because the process exited too early.
        be shutting down.
      `);
    }

    process.exit(1);
  }

  return child.status;
};

export default spawn;
