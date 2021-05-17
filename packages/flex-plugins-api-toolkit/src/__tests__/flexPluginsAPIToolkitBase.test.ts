import { ServiceHttpClient } from 'flex-plugins-api-client';

import FlexPluginsAPIToolkitBase from '../flexPluginsAPIToolkitBase';

describe('FlexPluginsAPIToolkitBase', () => {
  it('should load toolkit', () => {
    const mockHttpClient = jest.fn();
    const toolkit = new FlexPluginsAPIToolkitBase((mockHttpClient as unknown) as ServiceHttpClient);
    expect(toolkit.describePlugin).toBeTruthy();
  });
});
