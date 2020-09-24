import { expect, createTest } from '../../../../framework';
import FlexPluginsListPluginVersions from '../../../../../commands/flex/plugins/list/plugin-versions';

describe('Commands/List/FlexPluginsListPluginVersions', () => {
  const { sinon } = createTest(FlexPluginsListPluginVersions);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsListPluginVersions.hasOwnProperty('flags')).to.equal(true);
  });
});
