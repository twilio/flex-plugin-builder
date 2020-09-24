import { expect, createTest } from '../../../framework';
import FlexPluginsRelease from '../../../../commands/flex/plugins/release';

describe('Commands/FlexPluginsRelease', () => {
  const { sinon } = createTest(FlexPluginsRelease);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsRelease.hasOwnProperty('flags')).to.equal(true);
  });
});
