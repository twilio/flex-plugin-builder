import * as fs from '../../utils/fs';
import * as config from '../../utils/config';

describe('Utils/Config', () => {
  const topic1Name = 'topic1';
  const topicUnknownName = 'unknown-topic';
  const topic1 = {
    description: 'the-description',
    flags: {
      flag1: 'flag1 description',
    },
    args: {
      arg1: 'arg1 description',
    },
    defaults: {
      flag1: 'the default value',
    },
  };
  const pkg = {
    oclif: {
      topics: {
        topic1,
      },
    },
  };
  const readJsonFile = jest.spyOn(fs, 'readJsonFile');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getTopic', () => {
    it('should return empty object if package.json not found', () => {
      readJsonFile.mockReturnValue(null);

      const result = config.getTopic(topicUnknownName);

      expect(readJsonFile).toHaveBeenCalledTimes(1);
      expect(readJsonFile).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('package.json'));
      expect(result.description).toContain('No description available');
      expect(result).toHaveProperty('flags');
      expect(result).toHaveProperty('args');
      expect(result).toHaveProperty('defaults');
    });

    it('should return empty object if topic not found', () => {
      readJsonFile.mockReturnValue(pkg);

      const result = config.getTopic(topicUnknownName);

      expect(result.description).toContain('No description available');
      expect(result).toHaveProperty('flags');
      expect(result).toHaveProperty('args');
      expect(result).toHaveProperty('defaults');
    });

    it('should return topic', () => {
      readJsonFile.mockReturnValue(pkg);

      const result = config.getTopic(topic1Name);

      expect(result).toEqual(topic1);
    });
  });
});
