import { getAssetsUrl, getRuntimeUrl } from '../runtime';

describe('runtime', () => {
  describe('getRuntimeUrl', () => {
    const currentScript = {
      src: 'https://foo.twil.io/',
    };

    beforeAll(() => {
      // @ts-ignore
      Object.defineProperty(global.document, 'currentScript', { value: currentScript });
    });

    it('should return runtime url', () => {
      const url = getRuntimeUrl();

      expect(url).toEqual('https://foo.twil.io');
    });
  });

  describe('getAssetsUrl', () => {
    it('should return a string', () => {
      const assetsUrl: string = getAssetsUrl();
      expect(typeof assetsUrl).toEqual('string');
    });

    it('should postfix an `/assets`', () => {
      // Act
      const assetsUrl: string = getAssetsUrl();

      // Assert
      expect(assetsUrl).toMatch(/\/assets$/);
    });
  });
});
