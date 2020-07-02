import { expect } from 'chai';

import * as stringsUtils from '../../utils/strings';

describe('Utils/Strings', () => {
  describe('toSentenceCase', () => {
    it('should convert one word', () => {
      expect(stringsUtils.toSentenceCase('basic')).to.equal('Basic');
      expect(stringsUtils.toSentenceCase('sid')).to.equal('SID');
      expect(stringsUtils.toSentenceCase('url')).to.equal('URL');
    });

    it('should convert special two words', () => {
      expect(stringsUtils.toSentenceCase('basicName')).to.equal('Basic Name');

      // Special cases
      expect(stringsUtils.toSentenceCase('dateCreated')).to.equal('Created');
      expect(stringsUtils.toSentenceCase('dateUpdated')).to.equal('Updated');
      expect(stringsUtils.toSentenceCase('isPrivate')).to.equal('Access');
      expect(stringsUtils.toSentenceCase('isActive')).to.equal('Status');
    });

    it('should convert multiple words', () => {
      expect(stringsUtils.toSentenceCase('basicNameYo')).to.equal('Basic Name Yo');
      expect(stringsUtils.toSentenceCase('basicNameYoWithSid')).to.equal('Basic Name Yo With SID');
    });
  });
});
