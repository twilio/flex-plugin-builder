import { formatMessages, toMessageString } from '../formatMessages';

describe('formatMessages', () => {
  describe('toMessageString', () => {
    it('should return strings untouched', () => {
      expect(toMessageString('some error')).toEqual('some error');
    });

    it('should use the message of a webpack 5 error object', () => {
      expect(toMessageString({ message: 'Module not found' })).toEqual('Module not found');
    });

    it('should prefix the module name and location of a webpack 5 error object', () => {
      expect(toMessageString({ moduleName: './src/a.js', loc: '3:4', message: 'Module not found' })).toEqual(
        './src/a.js:3:4\nModule not found',
      );
      expect(toMessageString({ file: './src/b.ts', message: 'Bad' })).toEqual('./src/b.ts\nBad');
    });

    it('should not throw on empty values', () => {
      expect(toMessageString(null)).toEqual('');
      expect(toMessageString(undefined)).toEqual('');
      expect(toMessageString({})).toEqual('[object Object]');
    });
  });

  describe('formatMessages', () => {
    it('should not throw `message.split is not a function` on webpack 5 error objects', () => {
      const result = formatMessages(
        [{ moduleName: './src/a.js', message: "Module not found: Error: Can't resolve 'crypto'" }],
        [{ message: 'asset size limit exceeded' }],
      );

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain("Can't resolve 'crypto'");
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('asset size limit exceeded');
    });

    it('should format a mix of strings and objects', () => {
      const result = formatMessages(['ts error', { message: 'webpack error' }]);

      expect(result.errors).toHaveLength(2);
      expect(result.warnings).toEqual([]);
    });
  });
});
