import { expect } from 'chai';
import { ConfigurationContext } from 'twilio/lib/rest/flexApi/v1/configuration';

import { sinon } from '../framework';
import FlexConfigurationClient from '../../clients/FlexConfigurationClient';

describe('FlexConfigurationClient', () => {
  const fetch = sinon.mock().atLeast(1);
  const auth = {
    username: 'test-username',
    password: 'test-password',
    accountSid: 'AC00000000000000000000000000000000',
  };
  // @ts-ignore
  const twilioClient = { fetch } as ConfigurationContext;
  const client = new FlexConfigurationClient(twilioClient, auth);

  beforeEach(() => {
    sinon.reset();
  });

  describe('fetch', () => {
    it('calls fetch with serverlessSid already set', async () => {
      const sids = ['ZSxxx'];
      fetch.returns(
        Promise.resolve({
          serverlessServiceSids: sids,
        }),
      );
      const config = await client.fetch();

      expect(fetch).to.have.been.calledOnce;
      expect(config.serverlessServiceSids).to.eql(sids);
    });

    it('calls fetch with serverlessSid not set', async () => {
      fetch.returns(Promise.resolve({}));
      const config = await client.fetch();

      expect(fetch).to.have.been.calledOnce;
      expect(config.serverlessServiceSids).to.eql([]);
    });
  });

  describe('getServerlessSid', () => {
    it('should return nothing if entry is empty', async () => {
      fetch.returns(Promise.resolve({}));
      const result = await client.getServerlessSid();

      expect(fetch).to.have.been.calledOnce;
      expect(result).to.be.undefined;
    });

    it('should return first entry', async () => {
      fetch.returns(Promise.resolve({ serverlessServiceSids: ['first', 'second'] }));

      const result = await client.getServerlessSid();

      expect(fetch).to.have.been.calledOnce;
      expect(result).to.equal('first');
    });
  });

  describe('registerServerlessSid', () => {
    it('should do nothing if sid is already present', async () => {
      fetch.returns(
        Promise.resolve({
          serverlessServiceSids: ['ZS123'],
        }),
      );

      // @ts-ignore
      const updateServerlessSids = sinon.stub(client, 'updateServerlessSids');
      updateServerlessSids.returnsThis();
      await client.registerServerlessSid('ZS123');

      expect(fetch).to.have.been.calledOnce;
      expect(updateServerlessSids).not.to.have.been.called;
      updateServerlessSids.restore();
    });

    it('should register sid', async () => {
      fetch.returns(
        Promise.resolve({
          serverlessServiceSids: [],
        }),
      );
      // @ts-ignore
      const updateServerlessSids = sinon.stub(client, 'updateServerlessSids');
      updateServerlessSids.returnsThis();
      await client.registerServerlessSid('ZS123');

      expect(fetch).to.have.been.calledTwice;
      expect(updateServerlessSids).to.have.been.calledOnce;
      expect(updateServerlessSids).to.have.been.calledWith(['ZS123']);
      updateServerlessSids.restore();
    });
  });

  describe('unregisterServerlessSid', () => {
    it('should do nothing if sid does not exist', async () => {
      fetch.returns(
        Promise.resolve({
          serverlessServiceSids: ['ZS123'],
        }),
      );

      // @ts-ignore
      const updateServerlessSids = sinon.stub(client, 'updateServerlessSids');
      updateServerlessSids.returnsThis();
      await client.unregisterServerlessSid('ZS456');

      expect(fetch).to.have.been.calledOnce;
      expect(updateServerlessSids).not.to.have.been.called;
      updateServerlessSids.restore();
    });

    it('should remove sid', async () => {
      fetch.returns(
        Promise.resolve({
          serverlessServiceSids: ['ZS123', 'ZS456', 'ZS789'],
        }),
      );

      // @ts-ignore
      const updateServerlessSids = sinon.stub(client, 'updateServerlessSids');
      updateServerlessSids.returnsThis();
      await client.unregisterServerlessSid('ZS456');

      expect(fetch).to.have.been.calledTwice;
      expect(updateServerlessSids).to.have.been.calledOnce;
      expect(updateServerlessSids).to.have.been.calledWith(['ZS123', 'ZS789']);
      updateServerlessSids.restore();
    });
  });
});
