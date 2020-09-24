import { expect, createTest } from '../../../../framework';
import FlexPluginsDescribePlugin from '../../../../../commands/flex/plugins/describe/plugin';

describe('Commands/Describe/FlexPluginsDescribePlugin', () => {
  const { sinon } = createTest(FlexPluginsDescribePlugin);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDescribePlugin.hasOwnProperty('flags')).to.equal(true);
  });
});
