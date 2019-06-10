import { getAssetsUrl } from './runtime';

describe('runtime', () => {
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
