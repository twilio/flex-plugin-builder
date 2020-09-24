import { expect, createTest } from '../../../../framework';
import FlexPluginsDescribePluginVersion from '../../../../../commands/flex/plugins/describe/plugin-version';

describe('Commands/Describe/FlexPluginsDescribePluginVersion', () => {
  const { sinon } = createTest(FlexPluginsDescribePluginVersion);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDescribePluginVersion.hasOwnProperty('flags')).to.equal(true);
  });
});
