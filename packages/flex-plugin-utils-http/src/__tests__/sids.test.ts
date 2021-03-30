import * as sids from '../sids';

describe('Sids', () => {
  describe('looksLikeSid', () => {
    it('should return true', () => {
      expect(sids.looksLikeSid('AC00000000000000000000000000000000')).toEqual(true);
      expect(sids.looksLikeSid('AC0000000000000000000000000000000a')).toEqual(true);
    });

    it('should return false', () => {
      expect(sids.looksLikeSid('')).toEqual(false);
      expect(sids.looksLikeSid('AC000')).toEqual(false);
      expect(sids.looksLikeSid('AC0000000000000000000000000000000000000000000')).toEqual(false);
    });
  });
});
