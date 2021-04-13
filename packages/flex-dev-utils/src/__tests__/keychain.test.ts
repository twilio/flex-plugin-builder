import * as keychain from '../keychain';

describe('keychain', () => {
  const serviceName = 'the-service-name';
  const account = 'the-account';
  const password = 'the-password';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('_getKeytar', () => {
    it('should get keytar if it exists', () => {
      expect(keychain._getKeytar()).not.toBeNull();
    });
  });

  describe('default', () => {
    it('should instantiate keytar', async () => {
      const findCredentials = jest.fn();
      const deletePassword = jest.fn();
      const setPassword = jest.fn();
      const _getKeytar = jest.spyOn(keychain, '_getKeytar').mockReturnValue({
        findCredentials,
        deletePassword,
        setPassword,
      });

      const instance = keychain.default(serviceName);
      await instance.deletePassword(password);
      await instance.findCredentials();
      await instance.setPassword(account, password);

      expect(_getKeytar).toHaveBeenCalledTimes(1);
      expect(deletePassword).toHaveBeenCalledTimes(1);
      expect(deletePassword).toHaveBeenCalledWith(serviceName, password);
      expect(findCredentials).toHaveBeenCalledTimes(1);
      expect(findCredentials).toHaveBeenCalledWith(serviceName);
      expect(setPassword).toHaveBeenCalledTimes(1);
      expect(setPassword).toHaveBeenCalledWith(serviceName, account, password);
    });
  });
});
