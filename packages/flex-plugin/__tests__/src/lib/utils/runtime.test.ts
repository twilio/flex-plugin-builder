import {getAssetsUrl} from '../../../../src';

describe("runtime", () => {
	describe('getAssetsUrl', () => {
		it("should return a string", () => {
			const assetsUrl: string = getAssetsUrl();
			expect(assetsUrl).not.toEqual('')
		});

		it("should postfix an `/assets`", () => {
			// Act
			const assetsUrl: string = getAssetsUrl();

			// Assert
			expect(assetsUrl).toMatch(/\/assets$/);
		});
	});
});
