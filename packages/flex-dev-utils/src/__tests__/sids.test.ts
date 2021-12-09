import { isValidSid, isSidOfType, looksLikeSid } from '../sids';

describe('sids', () => {
  describe('looksLikeSid', () => {
    it('should return true', () => {
      expect(looksLikeSid('AC00000000000000000000000000000000')).toEqual(true);
      expect(looksLikeSid('AC0000000000000000000000000000000a')).toEqual(true);
    });

    it('should return false', () => {
      expect(looksLikeSid('')).toEqual(false);
      expect(looksLikeSid('AC000')).toEqual(false);
      expect(looksLikeSid('AC0000000000000000000000000000000000000000000')).toEqual(false);
    });
  });

  describe('isValidSid', () => {
    it('should test valid sids', () => {
      const sids = [
        'AC00000000000000000000000000000000',
        'US00000000000000000000000000000000',
        'AB00000000000000000000000000000001',
        'ZX00000000000000000000000000abcdef',
      ];

      sids.forEach((sid) => expect(isValidSid(sid)).toBeTruthy());
    });

    it('should test invalid sids', () => {
      const sids = [
        'AC',
        'US000000000000000000000000000000',
        'AB000000000000000000000000000000001',
        'AB0000000000000000000000000000000g',
        null,
      ];

      sids.forEach((sid) => expect(isValidSid(sid)).toBeFalsy());
    });
  });

  describe('isSidOfType', () => {
    it('should test true', () => {
      const sids = [
        ['AC00000000000000000000000000000000', 'AC'],
        ['US00000000000000000000000000000000', 'US'],
        ['AB00000000000000000000000000000001', 'Ab'],
        ['ZX00000000000000000000000000abcdef', 'ZX'],
      ];

      sids.map((data) => isSidOfType(data[0], data[1])).forEach((resp) => expect(resp).toBeTruthy());
    });

    it('should test false', () => {
      const sids = [
        ['AC00000000000000000000000000000000', 'AB'],
        ['AC00000000000000000000000000000000', null],
        [null, 'AB'],
      ];

      sids.map((data) => isSidOfType(data[0], data[1])).forEach((resp) => expect(resp).toBeFalsy());
    });
  });
});
