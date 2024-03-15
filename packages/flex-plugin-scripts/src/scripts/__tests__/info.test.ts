import * as packageUtil from '../../utils/package';
import * as infoScript from '../info';
import * as prints from '../../prints';

jest.mock('../../prints/packagesVersions');

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('../../prints/packagesVersions');
jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('info', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const foundPackage: packageUtil.PackageDetail = {
    name: 'found-package',
    found: true,
    package: {
      name: 'found-package',
      version: '1.2.3',
    },
  };

  const notFoundPackage: packageUtil.PackageDetail = {
    name: 'not-found-package',
    found: false,
    package: {},
  };

  describe('default', () => {
    it('should get package details and print them', async () => {
      const getPackageDetails = jest
        .spyOn(packageUtil, 'getPackageDetails')
        .mockReturnValue([foundPackage, notFoundPackage]);

      await infoScript.default();

      expect(getPackageDetails).toHaveBeenCalledTimes(1);
      expect(prints.packagesVersions).toHaveBeenCalledTimes(1);
      expect(prints.packagesVersions).toHaveBeenCalledWith([foundPackage], [notFoundPackage]);
    });
  });
});
