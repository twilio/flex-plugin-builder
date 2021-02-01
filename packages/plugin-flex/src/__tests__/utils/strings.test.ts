import * as stringsUtils from '../../utils/strings';

describe('Utils/Strings', () => {
  describe('toSentenceCase', () => {
    it('should convert one word', () => {
      expect(stringsUtils.toSentenceCase('basic')).toEqual('Basic');
      expect(stringsUtils.toSentenceCase('sid')).toEqual('SID');
      expect(stringsUtils.toSentenceCase('url')).toEqual('URL');
    });

    it('should convert special two words', () => {
      expect(stringsUtils.toSentenceCase('basicName')).toEqual('Basic Name');

      // Special cases
      expect(stringsUtils.toSentenceCase('dateCreated')).toEqual('Created');
      expect(stringsUtils.toSentenceCase('dateUpdated')).toEqual('Updated');
      expect(stringsUtils.toSentenceCase('isPrivate')).toEqual('Access');
      expect(stringsUtils.toSentenceCase('isActive')).toEqual('Status');
    });

    it('should convert multiple words', () => {
      expect(stringsUtils.toSentenceCase('basicNameYo')).toEqual('Basic Name Yo');
      expect(stringsUtils.toSentenceCase('basicNameYoWithSid')).toEqual('Basic Name Yo With SID');
    });
  });

  describe('isNullOrUndefined', () => {
    it('should return true', () => {
      expect(stringsUtils.isNullOrUndefined()).toEqual(true);
      expect(stringsUtils.isNullOrUndefined(undefined)).toEqual(true);
      expect(stringsUtils.isNullOrUndefined(null)).toEqual(true);
    });

    it('should return false', () => {
      expect(stringsUtils.isNullOrUndefined(1)).toEqual(false);
      expect(stringsUtils.isNullOrUndefined('')).toEqual(false);
      expect(stringsUtils.isNullOrUndefined(' ')).toEqual(false);
      expect(stringsUtils.isNullOrUndefined('a')).toEqual(false);
      expect(stringsUtils.isNullOrUndefined(false)).toEqual(false);
    });
  });
});
