import logSymbols from 'log-symbols';
import boxen from 'boxen';

import logger from '../utils/logger';

export default () => {
  const sym = logSymbols.warning;
  const msg = `${sym} Release script is currently in pilot and is limited in availability ${sym}`;
  const boxed = boxen(msg, {
    padding: 1,
    margin: 1,
  });

  logger.warning(boxed);
};
