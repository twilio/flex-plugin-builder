import { PackageDetail } from '../info';
import * as infoScript from '../info';
import * as prints from '../../prints';

jest.mock('flex-dev-utils/dist/logger');

describe('info', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const foundPackage: PackageDetail = {
    name: 'found-package',
    found: true,
    package: {
      name: 'found-package',
      version: '1.2.3',
    },
  };

  const notFoundPackage: PackageDetail = {
    name: 'not-found-package',
    found: false,
    package: {},
  };

  describe('default', () => {
    it('should get package details and print them', async () => {
      const _getPackageDetails = jest
        .spyOn(infoScript, '_getPackageDetails')
        .mockReturnValue([foundPackage, notFoundPackage]);

      const packagesVersion = jest
        .spyOn(prints, 'packagesVersion')
        .mockReturnThis();

      await infoScript.default();

      expect(_getPackageDetails).toHaveBeenCalledTimes(1);
      expect(packagesVersion).toHaveBeenCalledTimes(1);
      expect(packagesVersion).toHaveBeenCalledWith([foundPackage], [notFoundPackage]);
    });
  });
});
