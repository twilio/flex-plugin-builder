import { Logger } from 'flex-plugins-utils-logger';

import upgradePlugin from './upgradePlugin';

export default (logger: Logger) => {
  return {
    upgradePlugin: upgradePlugin(logger),
  };
};
