import { PluginServiceHTTPClient } from '../../clients';
import FlexPluginsAPIToolkitBase from '../flexPluginsAPIToolkitBase';

jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('FlexPluginsAPIToolkitBase', () => {
  it('should load toolkit', () => {
    const mockHttpClient = jest.fn();
    const toolkit = new FlexPluginsAPIToolkitBase(mockHttpClient as unknown as PluginServiceHTTPClient);
    expect(toolkit.describePlugin).toBeTruthy();
  });
});
