import { table as _table } from 'table';

import logger from '../logger';
import * as table from '../table';

jest.mock('../logger');
jest.mock('table');

describe('table', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('isRegularMatrix', () => {
    it('should return false for null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(table.isRegularMatrix(null as any)).toBeFalsy();
    });

    it('should return false for empty matrix', () => {
      expect(table.isRegularMatrix([])).toBeFalsy();
    });

    it('should return true for valid matrix', () => {
      expect(table.isRegularMatrix([[]])).toBeTruthy();
      expect(table.isRegularMatrix([['a']])).toBeTruthy();
      expect(table.isRegularMatrix([['a', 'b', 'c']])).toBeTruthy();
      expect(
        table.isRegularMatrix([
          ['a', 'b', 'c'],
          ['e', 'f', 'g'],
        ]),
      ).toBeTruthy();
    });

    it('should return true for invalid matrix', () => {
      expect(
        table.isRegularMatrix([
          ['a', 'b', 'c'],
          ['e', 'f'],
        ]),
      ).toBeFalsy();
    });
  });

  describe('printArray', () => {
    it('should print table', () => {
      table.printArray(['header'], [['data']]);

      expect(_table).toHaveBeenCalledTimes(1);
      expect(_table).toHaveBeenCalledWith([['HEADER'], ['data']], expect.any(Object));
      expect(logger.info).toHaveBeenCalledTimes(1);
    });

    it('should warn about irregular matrix', () => {
      const isRegularMatrix = jest.spyOn(table, 'isRegularMatrix').mockReturnValue(false);

      const data = [['data']];
      table.printArray(['header'], data);

      expect(isRegularMatrix).toHaveBeenCalledTimes(1);
      expect(isRegularMatrix).toHaveBeenCalledWith(data);
      expect(logger.warning).toHaveBeenCalledTimes(1);

      isRegularMatrix.mockRestore();
    });

    it('should warn about headers length not being the same as data length', () => {
      table.printArray(['header'], [['data', 'another']]);

      expect(logger.warning).toHaveBeenCalledTimes(1);
    });
  });

  describe('printObjectArray', () => {
    it('should do nothing if empty array is provided', () => {
      const printArray = jest.spyOn(table, 'printArray');

      table.printObjectArray([]);

      expect(printArray).not.toHaveBeenCalled();

      printArray.mockRestore();
    });

    it('should call printArray', () => {
      const printArray = jest.spyOn(table, 'printArray').mockImplementation(() => {
        /* no-op */
      });

      const data = [
        {
          foo: '123',
          bar: '456',
        },
        {
          foo: '124',
          bar: '457',
        },
      ];
      const header = ['foo', 'bar'];
      const rows = [
        ['123', '456'],
        ['124', '457'],
      ];

      table.printObjectArray(data);

      expect(printArray).toHaveBeenCalledTimes(1);
      expect(printArray).toHaveBeenCalledWith(header, rows);

      printArray.mockRestore();
    });
  });
});
