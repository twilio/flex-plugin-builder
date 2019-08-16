import { logger } from 'flex-dev-utils';
import * as credentials from 'flex-dev-utils/dist/credentials';

import * as clearScript from '../clear';

describe('clear', () => {
  it('should clear credentials', async () => {
    const clearCredentials = jest
      .spyOn(credentials, 'clearCredentials')
      .mockResolvedValue();

    await clearScript.default();

    expect(clearCredentials).toHaveBeenCalledTimes(1);
  });
});
