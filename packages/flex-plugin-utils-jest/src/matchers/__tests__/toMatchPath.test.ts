/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
import toMatchPath from '../toMatchPath';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchPath: (expected: string) => jest.CustomMatcherResult;
    }
    interface Expect {
      // @ts-ignore
      toMatchPath: typeof toMatchPath;
    }
  }
}

describe('toMatchPath', () => {
  const path1 = '/path/to/file';
  const path2 = '/path/to/another/file';

  expect.extend({
    toMatchPath: (actual: string, expected: string) => toMatchPath(actual).match(expected),
  });

  describe('symmetrically', () => {
    it('should test match path symmetrically', () => {
      expect(path1).toMatchPath(path1);
    });

    it('should test negative match path symmetrically', () => {
      expect(path1).not.toMatchPath(path2);
    });

    it('should test match path fail symmetrically', (done) => {
      try {
        expect(path1).toMatchPath(path2);
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain('toMatchPath');
        expect(e.message).not.toContain('not.toMatchPath');
        expect(e.message).toContain('Expected value to match');
        expect(e.message).toContain('Received');
        expect(e.message).toContain(path1);
        expect(e.message).toContain(path2);

        done();
      }
    });

    it('should test negate match path fail symmetrically', (done) => {
      try {
        expect(path1).not.toMatchPath(path1);
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain('not.toMatchPath');
        expect(e.message).toContain('Expected value not to match');
        expect(e.message).toContain('Received');
        expect(e.message).toContain(path1);

        done();
      }
    });
  });

  describe('asymmetrically', () => {
    it('should test match path symmetrically', () => {
      expect(path1).toEqual(expect.toMatchPath(path1));
    });

    it('should test negative match path symmetrically', () => {
      expect(path1).not.toEqual(expect.toMatchPath(path2));
    });

    it('should test match path fail symmetrically', (done) => {
      try {
        expect(path1).toEqual(expect.toMatchPath(path2));
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain(`toMatchPath<${path2}>`);

        done();
      }
    });
  });
});
