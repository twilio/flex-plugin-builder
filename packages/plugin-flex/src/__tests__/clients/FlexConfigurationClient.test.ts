import { expect } from 'chai';
import { ConfigurationContext } from 'twilio/lib/rest/flexApi/v1/configuration';

import { sinon } from '../framework';
import FlexConfigurationClient from '../../clients/FlexConfigurationClient';

describe('FlexConfigurationClient', () => {
  const fetch = sinon.mock();
  // @ts-ignore
  const twilioClient = { fetch } as ConfigurationContext;
  const client = new FlexConfigurationClient(twilioClient);

  beforeEach(() => {
    fetch.resetHistory();
  });

  it('calls fetch', async () => {
    await client.fetch();

    expect(fetch).to.have.been.calledOnce;
  });

  describe('getServerlessSid', () => {
    it('should return nothing if no config found', async () => {
      fetch.returns(Promise.resolve({}));

      const result = await client.getServerlessSid();

      expect(fetch).to.have.been.calledOnce;
      expect(result).to.be.null;
    });

    it('should return first entry', async () => {
      fetch.returns(Promise.resolve({ serverlessServiceSids: ['first', 'second'] }));

      const result = await client.getServerlessSid();

      expect(fetch).to.have.been.calledOnce;
      expect(result).to.equal('first');
    });
  });
});
