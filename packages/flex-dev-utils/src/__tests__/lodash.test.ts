import * as lodash from '../lodash';

describe('lodash', () => {
  it('should have the keys', () => {
    expect(lodash).toHaveProperty('camelCase');
    expect(lodash).toHaveProperty('upperFirst');
    expect(lodash).toHaveProperty('merge');
    expect(lodash).toHaveProperty('clone');
  });
});
