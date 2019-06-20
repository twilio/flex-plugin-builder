import { logger } from 'flex-dev-utils';

interface VersionsOptions {
  publicOnly: boolean;
  privateOnly: boolean;
}

export const _run = async (options: VersionsOptions) => {
  // no-op
};

const versions = async (...argv: string[]) => {
  const publicOnly = argv.includes('--public-only');
  const privateOnly = argv.includes('--private-only');

  if (publicOnly && privateOnly) {
    logger.error('You cannot use --public-only and --private-only flags together.');
    return process.exit(1);
  }

  const options: VersionsOptions = { publicOnly, privateOnly };

  await _run(options);
};

// Called directly/spawned
if (require.main === module) {
  (async () => await versions(...process.argv.splice(2)))().catch(logger.error);
}

export default versions;
