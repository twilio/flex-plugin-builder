import * as keychain from '../keychain';

describe('keychain', () => {
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

      const instance = keychain.default('the-service-name');
      await instance.deletePassword('password');
      await instance.findCredentials();
      await instance.setPassword('account', 'password');

      expect(_getKeytar).toHaveBeenCalledTimes(1);
      expect(deletePassword).toHaveBeenCalledTimes(1);
      expect(deletePassword).toHaveBeenCalledWith('the-service-name', 'password');
      expect(findCredentials).toHaveBeenCalledTimes(1);
      expect(findCredentials).toHaveBeenCalledWith('the-service-name');
      expect(setPassword).toHaveBeenCalledTimes(1);
      expect(setPassword).toHaveBeenCalledWith('the-service-name', 'account', 'password');
    });
  });
});
