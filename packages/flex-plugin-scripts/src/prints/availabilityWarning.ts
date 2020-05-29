import { boxen } from 'flex-dev-utils';

/**
 * Prints a warning message about the availability of the release script
 */
export default () => {
  boxen.warning('Release script is currently in pilot and is limited in availability');
};
