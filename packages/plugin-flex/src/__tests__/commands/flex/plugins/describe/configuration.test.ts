import { expect, createTest } from '../../../../framework';
import FlexPluginsDescribeConfiguration from '../../../../../commands/flex/plugins/describe/configuration';

describe('Commands/Describe/FlexPluginsDescribeConfiguration', () => {
  const { sinon } = createTest(FlexPluginsDescribeConfiguration);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDescribeConfiguration.hasOwnProperty('flags')).to.equal(true);
  });
});
