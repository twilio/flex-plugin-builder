import getRegistryVersion from '../getRegistryVersion';

jest.mock('package-json');

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const packageJson = require('package-json');

describe('getRegistryVersion', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should call to package-json with latest', async () => {
    packageJson.mockResolvedValue({ version: '3.0.0' });

    await getRegistryVersion('test-dir', 'latest');

    expect(packageJson).toHaveBeenCalledTimes(1);
    expect(packageJson).toHaveBeenCalledWith('test-dir', { version: 'latest' });
  });

  it('should call to package-json with beta', async () => {
    packageJson.mockResolvedValue({ version: '3.0.0-beta' });

    await getRegistryVersion('test-dir', 'beta');

    expect(packageJson).toHaveBeenCalledTimes(1);
    expect(packageJson).toHaveBeenCalledWith('test-dir', { version: 'beta' });
  });

  it('should call to package-json with alpha', async () => {
    packageJson.mockResolvedValue({ version: '3.0.0-alpha' });

    await getRegistryVersion('test-dir', 'alpha');

    expect(packageJson).toHaveBeenCalledTimes(1);
    expect(packageJson).toHaveBeenCalledWith('test-dir', { version: 'alpha' });
  });

  it('should call to package-json with default', async () => {
    packageJson.mockResolvedValue({ version: '3.0.0' });

    await getRegistryVersion('test-dir');

    expect(packageJson).toHaveBeenCalledTimes(1);
    expect(packageJson).toHaveBeenCalledWith('test-dir', { version: 'latest' });
  });
});
