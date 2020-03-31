import * as server from '../../start/server';

describe('server', () => {
  describe('getDefaultPort', () => {
    it('should return default if no port is provided', () => {
      expect(server.getDefaultPort()).toEqual(server.DEFAULT_PORT);
    });

    it('should return default if port is an empty string', () => {
      expect(server.getDefaultPort('')).toEqual(server.DEFAULT_PORT);
    });

    it('should return default if port is not not a number string', () => {
      expect(server.getDefaultPort('abc')).toEqual(server.DEFAULT_PORT);
    });

    it('should return port passed', () => {
      expect(server.getDefaultPort('123')).toEqual(123);
    });

    it('should return int from float port passed', () => {
      expect(server.getDefaultPort('123.456')).toEqual(123);
    });
  });
});
