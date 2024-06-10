import npmGetPackageInfo from 'npm-get-package-info';
import updateNotifier from 'update-notifier';

import * as fs from '../fs';
import { checkForUpdate } from '../updateNotifier';
import { chalk } from '../..';

jest.mock('npm-get-package-info');
jest.mock('update-notifier');

const getPackageInfoMock = npmGetPackageInfo as jest.Mock;
const updateNotifierMock = updateNotifier as unknown as jest.Mock;

describe('checkForUpdate', () => {
  jest.spyOn(fs, 'readAppPackageJson').mockReturnValue({
    name: 'pkg',
    version: '4.0.0',
  } as fs.AppPackageJson);

  const notifySpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show deprecation notice', async () => {
    getPackageInfoMock.mockResolvedValue({
      deprecated: true,
    });
    updateNotifierMock.mockReturnValue({
      notify: notifySpy,
      update: {
        current: '4.0.0',
        latest: '4.0.0',
      },
    });

    await checkForUpdate();
    expect(notifySpy).toHaveBeenCalledWith({
      message: expect.stringContaining('deprecated'),
    });
  });

  it('should show appropriate update available message', async () => {
    getPackageInfoMock.mockResolvedValue({
      deprecated: true,
    });
    updateNotifierMock.mockReturnValue({
      notify: notifySpy,
      update: {
        current: '4.0.0',
        latest: '5.0.0',
      },
    });

    await checkForUpdate();
    expect(notifySpy).toHaveBeenCalledWith({
      message: expect.stringContaining(`${chalk.dim('4.0.0')}${chalk.reset(' → ')}${chalk.green('5.0.0')}`),
    });
  });
});
