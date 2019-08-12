import * as random from '../random';

describe('random', () => {
  describe('_randomGenerator', () => {
    it('should generate a random string', () => {
      const str1 = random._randomGenerator(1);
      const str2 = random._randomGenerator(2);
      const str4 = random._randomGenerator(4);
      const str8 = random._randomGenerator(8);

      expect(typeof str1).toBe('string');
      expect(typeof str2).toBe('string');
      expect(typeof str4).toBe('string');
      expect(typeof str8).toBe('string');

      expect(str1).toHaveLength(1);
      expect(str2).toHaveLength(2);
      expect(str4).toHaveLength(4);
      expect(str8).toHaveLength(8);
    });
  });

  describe('randomString', () => {
    it('should return a random string if no array is provided', () => {
      const _randomGenerator = jest.spyOn(random, '_randomGenerator');
      const str = random.randomString(4);

      expect(typeof str).toBe('string');
      expect(str).toHaveLength(4);
      expect(_randomGenerator).toHaveBeenCalledTimes(1);
      expect(_randomGenerator).toHaveBeenCalledWith(4);

      _randomGenerator.mockRestore();
    });

    it('should iterate until a unique random is found', () => {
      let firstCall = true;
      const _randomGenerator = jest.spyOn(random, '_randomGenerator').mockImplementation(() => {
        if (firstCall) {
          firstCall = false;

          return 'first';
        }

        return 'second';
      });

      const str = random.randomString(5, ['first']);

      expect(str).toEqual('second');
      expect(_randomGenerator).toHaveBeenCalledTimes(2);
      expect(_randomGenerator).toHaveBeenCalledWith(5);

      _randomGenerator.mockRestore();
    });
  });
});
