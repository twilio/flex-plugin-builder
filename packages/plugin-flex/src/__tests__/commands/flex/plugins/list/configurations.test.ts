import { expect, createTest } from '../../../../framework';
import FlexPluginsListConfigurations from '../../../../../commands/flex/plugins/list/configurations';

describe('Commands/List/FlexPluginsListConfigurations', () => {
  const { sinon } = createTest(FlexPluginsListConfigurations);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsListConfigurations.hasOwnProperty('flags')).to.equal(true);
  });
});
