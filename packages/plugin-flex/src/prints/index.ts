import { Logger } from 'flex-plugins-utils-logger';

import upgradePlugin from './upgradePlugin';
import deploy from './deploy';
import release from './release';

export default (logger: Logger) => {
  return {
    upgradePlugin: upgradePlugin(logger),
    deploy: deploy(logger),
    release: release(logger),
  };
};
