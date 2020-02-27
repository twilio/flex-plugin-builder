import { warning } from 'flex-dev-utils/dist/boxen';

/**
 * Prints a warning message about the availability of Plugins API
 */
export default () => {
  warning('Plugins API is currently offered as a Pilot; it is very likely to change before the product reaches general availability.');
};
