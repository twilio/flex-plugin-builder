import { expect, createTest } from '../../../../framework';
import FlexPluginsDescribeRelease from '../../../../../commands/flex/plugins/describe/release';

describe('Commands/Describe/FlexPluginsDescribeRelease', () => {
  const { sinon } = createTest(FlexPluginsDescribeRelease);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDescribeRelease.hasOwnProperty('flags')).to.equal(true);
  });
});
