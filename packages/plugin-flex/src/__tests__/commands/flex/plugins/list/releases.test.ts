import { expect, createTest } from '../../../../framework';
import FlexPluginsListPlugins from '../../../../../commands/flex/plugins/list/releases';

describe('Commands/List/FlexPluginsListPlugins', () => {
  const { sinon } = createTest(FlexPluginsListPlugins);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsListPlugins.hasOwnProperty('flags')).to.equal(true);
  });
});
