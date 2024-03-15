import { Credential } from '@twilio/flex-dev-utils';

import DeploymentClient from '../deployments';
import ServerlessClient from '../serverless-client';

describe('DeploymentClient', () => {
  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };
  const baseClient = new ServerlessClient(auth.username, auth.password);

  describe('constructor', () => {
    it('should throw error if invalid serviceSid is provided', (done) => {
      const serviceSid = 'ZE00000000000000000000000000000000';
      const environmentSid = 'ZE00000000000000000000000000000000';

      try {
        // eslint-disable-next-line no-new
        new DeploymentClient(baseClient, serviceSid, environmentSid);
      } catch (e) {
        expect(e.message).toContain('is not of type ZS');
        expect(e.message).toContain(serviceSid);
        done();
      }
    });

    it('should throw error if invalid environmentSid is provided', (done) => {
      const serviceSid = 'ZS00000000000000000000000000000000';
      const environmentSid = 'ZB00000000000000000000000000000000';

      try {
        // eslint-disable-next-line no-new
        new DeploymentClient(baseClient, serviceSid, environmentSid);
      } catch (e) {
        expect(e.message).toContain('is not of type ZE');
        expect(e.message).toContain(environmentSid);
        done();
      }
    });
  });

  describe('create', () => {
    const serviceSid = 'ZS00000000000000000000000000000000';
    const environmentSid = 'ZE00000000000000000000000000000000';

    it('should warn if incorrect sid is provided to remove', async (done) => {
      const sid = 'ZS00000000000000000000000000000000';
      const client = new DeploymentClient(baseClient, serviceSid, environmentSid);

      try {
        await client.create(sid);
      } catch (e) {
        expect(e.message).toContain('is not of type ZB');
        expect(e.message).toContain(sid);
        done();
      }
    });

    it('should create deployment', async () => {
      const sid = 'ZB00000000000000000000000000000000';
      const deploy = { sid: 'ZDxxx' };
      const client = new DeploymentClient(baseClient, serviceSid, environmentSid);
      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue(deploy);

      const result = await client.create(sid);

      expect(result).toEqual(deploy);
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(`Services/${serviceSid}/Environments/${environmentSid}/Deployments`, {
        BuildSid: sid,
      });

      post.mockRestore();
    });
  });
});
