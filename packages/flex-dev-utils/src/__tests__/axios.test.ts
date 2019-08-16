import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as Axios from '../axios';

describe('axios', () => {
  it('should have the keys', () => {
    expect(Axios.default).toBe(axios);
    expect(Axios.MockAdapter).toBe(MockAdapter);
  });
});
