import { PluginServiceHTTPClient, ReleaseResource, ReleasesClient } from 'flex-plugins-api-client';

import releaseScript from '../release';

describe('ReleaseScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const releaseClient = new ReleasesClient(httpClient);

  const create = jest.spyOn(releaseClient, 'create');

  const release: ReleaseResource = {
    sid: 'FK00000000000000000000000000000000',
    account_sid: 'AC00000000000000000000000000000000',
    configuration_sid: 'FJ00000000000000000000000000000000',
    date_created: '',
  };

  const script = releaseScript(releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a release', async () => {
    create.mockResolvedValue(release);
    const result = await script({ configurationSid: release.configuration_sid });

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith({ ConfigurationId: release.configuration_sid });
    expect(result).toEqual({
      configurationSid: release.configuration_sid,
      releaseSid: release.sid,
      dateCreated: release.date_created,
    });
  });
});
