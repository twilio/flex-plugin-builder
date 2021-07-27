import * as semver from '../semver';

describe('semver', () => {
  describe('versionSatisfiesRange', () => {
    it('should satisfy the ranges', () => {
      expect(semver.versionSatisfiesRange('1.0.0', '>=1.0.0')).toEqual(true);
      expect(semver.versionSatisfiesRange('1.0.0-alpha.0', '>=0.9.0')).toEqual(true);
      expect(semver.versionSatisfiesRange('1.0.0', '1.0.0')).toEqual(true);
      expect(semver.versionSatisfiesRange('1.0.0', '>=0.9.0')).toEqual(true);
    });

    it('should not satisfy the ranges', () => {
      expect(semver.versionSatisfiesRange('1.0.0', '>2.0.0')).toEqual(false);
      expect(semver.versionSatisfiesRange('1.0.0-alpha.0', '>=2.0.0')).toEqual(false);
      expect(semver.versionSatisfiesRange('1.0.0', '>1.0.0')).toEqual(false);
    });
  });
});
