import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import EnvironmentClient from '../environments';

jest.mock('../../utils/paths', () => ({
  packageName: 'plugin-test',
}));

describe('EnvironmentClient', () => {
  const auth: AuthConfig = {
    accountSid: 'ACxxx',
    authToken: 'abc',
  };
  const environmentMatch = { sid: 'ZE00000000000000000000000000000000', unique_name: 'plugin-test' };
  const environmentAnother = { sid: 'ZE00000000000000000000000000000001', unique_name: 'plugin-sample' };
  const resourceWithMatch = {
    environments: [ environmentMatch, environmentAnother ],
  };
  const resourceWithNoMatch = {
    environments: [ environmentAnother ],
  };

  it('should fail if incorrect serviceSid is provided', (done) => {
    try {
      // tslint:disable-next-line
      new EnvironmentClient(auth, 'ZFxxx');
    } catch (e) {
      expect(e.message).toContain('not valid');
      expect(e.message).toContain('ZFxxx');
      done();
    }
  });

  it('should get and find environment', async () => {
    const client = new EnvironmentClient(auth, 'ZS00000000000000000000000000000000');
    // @ts-ignore
    const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithMatch);
    const create = jest.spyOn(client, 'create');

    const environment = await client.get();

    expect(environment).toEqual(environmentMatch);
    expect(list).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();

    list.mockRestore();
    create.mockRestore();
  });

  it('should not find environment, but then create it', async () => {
    const client = new EnvironmentClient(auth, 'ZS00000000000000000000000000000000');
    // @ts-ignore
    const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithNoMatch);
    // @ts-ignore
    const create = jest.spyOn(client, 'create').mockResolvedValue(environmentAnother);

    const environment = await client.get();

    expect(environment).toEqual(environmentAnother);
    expect(list).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);

    list.mockRestore();
    create.mockRestore();
  });

  it('should not find environment, and throw an exception', async (done) => {
    const client = new EnvironmentClient(auth, 'ZS00000000000000000000000000000000');
    // @ts-ignore
    const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithNoMatch);
    const create = jest.spyOn(client, 'create');

    try {
      await client.get(false);
    } catch (e) {
      list.mockRestore();
      create.mockRestore();

      done();
    }
  });

  it('should warn if incorrect sid is provided to remove', async (done) => {
    const client = new EnvironmentClient(auth, 'ZS00000000000000000000000000000000');

    try {
      await client.remove('ZS00000000000000000000000000000000');
    } catch (e) {
      expect(e.message).toContain('not of type ZE');
      done();
    }
  });
});
