import { isValidSid, isSidOfType } from '../sids';

describe('sids', () => {
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
      ];

      sids.forEach((sid) => expect(isValidSid(sid)).toBeFalsy());
    });
  });

  describe('isSidOfType', () => {
    it('should test true', () => {
      const sids = [
        ['AC', 'AC00000000000000000000000000000000'],
        ['US', 'US00000000000000000000000000000000'],
        ['AB', 'AB00000000000000000000000000000001'],
        ['ZX', 'ZX00000000000000000000000000abcdef'],
      ];

      sids.map((data) => isSidOfType(data[1], data[0]))
        .forEach((resp) => expect(resp).toBeTruthy());
    });
  });
});
