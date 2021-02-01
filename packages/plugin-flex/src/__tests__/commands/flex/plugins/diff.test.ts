/* eslint-disable camelcase */
import { Diff } from 'flex-plugins-api-toolkit';

import createTest from '../../../framework';
import FlexPluginsDiff from '../../../../commands/flex/plugins/diff';

describe('Commands/FlexPluginsDeploy', () => {
  const configId1 = 'FJ00000000000000000000000000001';
  const configId2 = 'FJ00000000000000000000000000002';

  const prefix = FlexPluginsDiff.pluginDiffPrefix;
  const diffs: Diff = {
    oldSid: configId1,
    newSid: configId2,
    activeSid: null,
    configuration: [
      {
        path: 'name',
        before: 'before-name',
        after: 'after-name',
        hasDiff: true,
      },
      {
        path: 'description',
        before: 'description',
        after: 'description',
        hasDiff: false,
      },
    ],
    plugins: {
      'plugin-one': [
        {
          path: 'pluginVersionSid',
          before: 'FV00000000000000000000000000001',
          after: 'FV00000000000000000000000000002',
          hasDiff: true,
        },
        {
          path: 'phase',
          before: 3,
          after: 3,
          hasDiff: false,
        },
      ],
      'plugin-deleted': [
        {
          path: 'pluginSid',
          before: 'FP00000000000000000000000000001',
          after: null,
          hasDiff: true,
        },
      ],
      'plugin-added': [
        {
          path: 'name',
          before: null,
          after: 'plugin-added',
          hasDiff: true,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsDiff.hasOwnProperty('flags')).toEqual(true);
  });

  it('should call toolkit and get the diff', async () => {
    const cmd = await createTest(FlexPluginsDiff)(configId1, configId2);

    jest.spyOn(cmd, 'getDiffs').mockResolvedValue(diffs);
    jest.spyOn(cmd, 'printDiff').mockReturnThis();
    jest.spyOn(cmd, 'printHeader').mockReturnThis();

    await cmd.doRun();

    expect(cmd.getDiffs).toHaveBeenCalledTimes(1);
    expect(cmd.printHeader).toHaveBeenCalledTimes(1);
    expect(cmd.printHeader).toHaveBeenCalledWith('Plugins');
    expect(cmd.printDiff).toHaveBeenCalledTimes(6);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.configuration[0]);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.configuration[1]);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.plugins['plugin-one'][0], prefix);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.plugins['plugin-one'][1], prefix);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.plugins['plugin-added'][0], prefix);
    expect(cmd.printDiff).toHaveBeenCalledWith(diffs.plugins['plugin-deleted'][0], prefix);
  });
});
