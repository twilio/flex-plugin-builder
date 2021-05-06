import { boxen, env } from 'flex-dev-utils';

/**
 * Prints a warning message about the availability of the release script
 */
export default (): void => {
  env.setQuiet(false);
  boxen.warning('Release script is currently in pilot and is limited in availability');
  env.setQuiet(true);
};
