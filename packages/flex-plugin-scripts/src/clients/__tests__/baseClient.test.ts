import BaseClient from '../baseClient';

describe('baseClient', () => {
  describe('getUserAgent', () => {
    it('should set the default agent', () => {
      expect(BaseClient.getUserAgent([])).toEqual('Flex Plugin Builder');
    });
  });
});
