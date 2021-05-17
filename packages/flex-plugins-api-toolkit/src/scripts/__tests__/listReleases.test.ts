import { PluginServiceHTTPClient, ReleasesClient } from 'flex-plugins-api-client';

import listReleasesScript from '../listReleases';
import { meta, release } from './mockStore';

describe('ListReleasesScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const releaseClient = new ReleasesClient(httpClient);

  const list = jest.spyOn(releaseClient, 'list');

  const script = listReleasesScript(releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list releases without pagination', async () => {
    list.mockResolvedValue({ releases: [release], meta });
    const result = await script({});

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(undefined);
    expect(result.releases).toHaveLength(1);
    expect(result.releases[0]).toEqual({
      sid: release.sid,
      configurationSid: release.configuration_sid,
      dateCreated: release.date_created,
    });
    expect(result.meta).toEqual(meta);
  });

  it('should list releases with pagination', async () => {
    list.mockResolvedValue({ releases: [release], meta });
    const result = await script({ page: { pageSize: 1 } });

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith({ pageSize: 1 });
    expect(result.releases).toHaveLength(1);
    expect(result.releases[0]).toEqual({
      sid: release.sid,
      configurationSid: release.configuration_sid,
      dateCreated: release.date_created,
    });
    expect(result.meta).toEqual(meta);
  });
});
