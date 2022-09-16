import { baseCommands } from '@twilio/cli-core';

import FlexPluginsCreate from '../../../../commands/flex/plugins/create';
import '../../../framework';

describe('Commands/FlexPluginsCreate', () => {
  it('should have own flags', () => {
    expect(FlexPluginsCreate.flags).not.toBeSameObject(baseCommands.TwilioClientCommand.flags);
  });
});
