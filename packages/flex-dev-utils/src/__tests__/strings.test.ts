import * as strings from '../strings';

describe('strings', () => {
  describe('multilineString', () => {
    it('should return single line string for one argument', () => {
      const result = strings.multilineString('line1');

      expect(result).toEqual('line1');
    });

    it('should return single line string for multiple arguments', () => {
      const result = strings.multilineString('line1', 'line2', 'line3');

      expect(result).toEqual('line1\r\nline2\r\nline3');
    });
  });

  describe('stringLineString', () => {
    it('should return single line for one argument', () => {
      const result = strings.singleLineString('line1');

      expect(result).toEqual('line1');
    });

    it('should return string line for multiple arguments', () => {
      const result = strings.singleLineString('line1', 'line2', 'line3');

      expect(result).toEqual('line1 line2 line3');
    });

    it('should trim correctly', () => {
      const result = strings.singleLineString(' line1   ', '  line2', 'line3   ');

      expect(result).toEqual('line1 line2 line3');
    });
  });
});
