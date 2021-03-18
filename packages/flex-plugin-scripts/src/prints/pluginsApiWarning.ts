import { boxen, env } from 'flex-dev-utils';

/**
 * Prints a warning message about the availability of Plugins API
 */
export default (): void => {
  env.setQuiet(false);
  boxen.warning(
    'Plugins API is currently offered as a Pilot; it is very likely to change before the product reaches general availability.',
  );
  env.setQuiet(true);
};
