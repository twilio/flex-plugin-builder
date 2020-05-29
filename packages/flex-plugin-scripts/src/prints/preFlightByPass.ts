import { logger, multilineString } from 'flex-dev-utils';

/**
 * Prints the SKIP_PREFLIGHT_CHECK message
 *
 * @param skip  whether SKIP_PREFLIGHT_CHECK is already set
 */
export default (skip: boolean) => {
  if (skip) {
    logger.warning(
      'SKIP_PREFLIGHT_CHECK=true is used and the warning is ignored; your script will continue.',
    );
  } else {
    logger.warning(multilineString(
      'If you like to skip this and proceed anyway, use SKIP_PREFLIGHT_CHECK=true environment variable.',
      'This will disable checks and allow you to run your application.',
    ));
  }
};
