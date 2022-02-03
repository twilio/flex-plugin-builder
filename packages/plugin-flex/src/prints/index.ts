import { Logger } from '@twilio/flex-dev-utils';

import upgradePlugin from './upgradePlugin';
import deploy from './deploy';
import release from './release';
import flexPlugin from './flexPlugin';
import archiveResource from './archiveResource';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => {
  return {
    upgradePlugin: upgradePlugin(logger),
    deploy: deploy(logger),
    release: release(logger),
    flexPlugin: flexPlugin(logger),
    archiveResource: archiveResource(logger),
  };
};
