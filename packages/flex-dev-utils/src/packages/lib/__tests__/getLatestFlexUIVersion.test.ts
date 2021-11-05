import * as getRegistryVersionScripts from '../getRegistryVersion';
import getLatestFlexUIVersion from '../getLatestFlexUIVersion';

const flexUI = '@twilio/flex-ui';
const abbreviatedMetadata = {
  name: flexUI,
  dependencies: {},
  bin: {},
  dist: {},
  engines: {},
  versions: {},
  modified: '',
  'dist-tags': { latest: '' },
};

describe('getLatestFlexUIVersion', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return the latest verison', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0', ...abbreviatedMetadata });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(1);
    expect(getRegistryVersion).toHaveBeenCalledWith(flexUI, 'latest');
  });

  it('should return the beta version', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0', ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-beta', ...abbreviatedMetadata });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(2);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, flexUI, 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, flexUI, 'beta');
  });

  it('should return the alpha version', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0', ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-beta', ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-alpha', ...abbreviatedMetadata });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(3);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, flexUI, 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, flexUI, 'beta');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(3, flexUI, 'alpha');
  });

  it('should throw error if requested major version is not available', async (done) => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0', ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-beta', ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-alpha', ...abbreviatedMetadata });

    try {
      await getLatestFlexUIVersion(2);
    } catch (e) {
      expect(e.message).toEqual('The major version you requested for flex ui (2) does not exist.');
      done();
    }
  });

  it('should throw error if versions returned are undefined', async (done) => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValue(undefined);

    try {
      await getLatestFlexUIVersion(2);
    } catch (e) {
      expect(e.message).toEqual('The major version you requested for flex ui (2) does not exist.');
      done();
    }
  });

  it('should go to beta if latest is undefined', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce(undefined);
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-beta', ...abbreviatedMetadata });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(2);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, flexUI, 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, flexUI, 'beta');
  });

  it('should go to beta if latest doesnt contain a version', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    getRegistryVersion.mockResolvedValueOnce({ ...abbreviatedMetadata });
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-beta', ...abbreviatedMetadata });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(2);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, flexUI, 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, flexUI, 'beta');
  });
});
