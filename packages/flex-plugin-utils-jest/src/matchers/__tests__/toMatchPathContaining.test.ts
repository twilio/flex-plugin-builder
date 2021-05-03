/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
import toMatchPathContaining from '../toMatchPathContaining';

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchPathContaining: (expected: string) => jest.CustomMatcherResult;
    }
    interface Expect {
      // @ts-ignore
      toMatchPathContaining: typeof toMatchPathContaining;
    }
  }
}

describe('toMatchPathContaining', () => {
  const path1 = '/path/to/file';
  const path1Incomplete = 'to/file';
  const path2 = 'another/file';

  expect.extend({
    toMatchPathContaining: (actual: string, expected: string) => toMatchPathContaining(actual).match(expected),
  });

  describe('symmetrically', () => {
    it('should test match path symmetrically', () => {
      expect(path1).toMatchPathContaining(path1Incomplete);
    });

    it('should test negative match path symmetrically', () => {
      expect(path1).not.toMatchPathContaining(path2);
    });

    it('should test match path fail symmetrically', (done) => {
      try {
        expect(path1).toMatchPathContaining(path2);
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain('toMatchPathContaining');
        expect(e.message).not.toContain('not.toMatchPathContaining');
        expect(e.message).toContain('Expected value to match');
        expect(e.message).toContain('Received');
        expect(e.message).toContain(path1);
        expect(e.message).toContain(path2);

        done();
      }
    });

    it('should test negate match path fail symmetrically', (done) => {
      try {
        expect(path1).not.toMatchPathContaining(path1);
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain('not.toMatchPathContaining');
        expect(e.message).toContain('Expected value not to match');
        expect(e.message).toContain('Received');
        expect(e.message).toContain(path1);

        done();
      }
    });
  });

  describe('asymmetrically', () => {
    it('should test match path symmetrically', () => {
      expect(path1).toEqual(expect.toMatchPathContaining(path1Incomplete));
    });

    it('should test negative match path symmetrically', () => {
      expect(path1).not.toEqual(expect.toMatchPathContaining(path2));
    });

    it('should test match path fail symmetrically', (done) => {
      try {
        expect(path1).toEqual(expect.toMatchPathContaining(path2));
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain(`toMatchPathContaining<${path2}>`);

        done();
      }
    });

    it('should test negate match path fail symmetrically', (done) => {
      try {
        expect(path1).not.toEqual(expect.toMatchPathContaining(path1Incomplete));
      } catch (e) {
        expect(e.constructor.name).toEqual('JestAssertionError');
        expect(e.message).toContain(`toMatchPathContaining<${path1Incomplete}>`);

        done();
      }
    });
  });
});
