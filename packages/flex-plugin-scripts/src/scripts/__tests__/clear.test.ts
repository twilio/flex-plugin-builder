import * as credentials from '@twilio/flex-dev-utils/dist/credentials';

import * as clearScript from '../clear';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('clear', () => {
  it('should clear credentials', async () => {
    const clearCredentials = jest.spyOn(credentials, 'clearCredentials').mockResolvedValue();

    await clearScript.default();

    expect(clearCredentials).toHaveBeenCalledTimes(1);

    clearCredentials.mockRestore();
  });
});
