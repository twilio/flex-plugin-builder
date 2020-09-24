import { expect, createTest } from '../../../framework';
import FlexPluginsCreateConfiguration from '../../../../commands/flex/plugins/create-configuration';

describe('Commands/FlexPluginsCreateConfiguration', () => {
  const { sinon } = createTest(FlexPluginsCreateConfiguration);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsCreateConfiguration.hasOwnProperty('flags')).to.equal(true);
  });
});
