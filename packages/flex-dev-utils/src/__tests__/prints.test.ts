import * as prints from '../prints';
import * as strings from '../logger';

jest.mock('../logger');

describe('prints', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('printList', () => {
    it('should call printList with no lines', () => {
      const multilineString = jest.spyOn(strings, 'multilineString');

      prints.printList();
      expect(multilineString).toHaveBeenCalledTimes(1);
      expect(multilineString).toHaveBeenCalledWith();
    });

    it('should call printList with 2 lines', () => {
      const multilineString = jest.spyOn(strings, 'multilineString');

      prints.printList('item1', 'item2');
      expect(multilineString).toHaveBeenCalledTimes(1);
      expect(multilineString).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });
  });
});
