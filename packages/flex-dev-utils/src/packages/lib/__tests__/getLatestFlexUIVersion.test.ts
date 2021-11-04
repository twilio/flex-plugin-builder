import * as getRegistryVersionScripts from '../getRegistryVersion';
import getLatestFlexUIVersion from '../getLatestFlexUIVersion';

describe('getLatestFlexUIVersion', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return the latest verison', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0' });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(1);
    expect(getRegistryVersion).toHaveBeenCalledWith('@twilio/flex-ui', 'latest');
  });

  it('should return the beta version', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0' });
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-beta' });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(2);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, '@twilio/flex-ui', 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, '@twilio/flex-ui', 'beta');
  });

  it('should return the alpha version', async () => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0' });
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-beta' });
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '2.0.0-alpha' });

    await getLatestFlexUIVersion(2);

    expect(getRegistryVersion).toHaveBeenCalledTimes(3);
    expect(getRegistryVersion).toHaveBeenNthCalledWith(1, '@twilio/flex-ui', 'latest');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(2, '@twilio/flex-ui', 'beta');
    expect(getRegistryVersion).toHaveBeenNthCalledWith(3, '@twilio/flex-ui', 'alpha');
  });

  it('should throw error if requested major version is not available', async (done) => {
    const getRegistryVersion = jest.spyOn(getRegistryVersionScripts, 'default');
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0' });
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-beta' });
    // @ts-ignore
    getRegistryVersion.mockResolvedValueOnce({ version: '1.0.0-alpha' });

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
});
