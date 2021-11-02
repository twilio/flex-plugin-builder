import getRegistryVersion from '../getRegistryVersion';

jest.mock('package-json');

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const packageJson = require('package-json');

describe('getRegistryVersion', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should call to package-json', async () => {
    packageJson.mockResolvedValue({ version: '3.0.0' });

    await getRegistryVersion('test-dir', 'latest');

    expect(packageJson).toHaveBeenCalledTimes(1);
    expect(packageJson).toHaveBeenCalledWith('test-dir', { version: 'latest' });
  });
});
