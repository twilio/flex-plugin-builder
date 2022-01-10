import axios from 'axios';

import { testParams } from '../core';

interface Service {
  // eslint-disable-next-line camelcase
  unique_name: string;
  sid: string;
}

interface Environment {
  // eslint-disable-next-line camelcase
  unique_name: string;
  // eslint-disable-next-line camelcase
  build_sid: string;
  sid: string;
}

interface Build {}

const realm = testParams.config.region ? `${testParams.config.region}.` : '';
const baseUrl = `https://serverless.${realm}twilio.com/v1`;
const auth = {
  username: testParams.secrets.api.accountSid,
  password: testParams.secrets.api.authToken,
};

const get = async (uri: string) => {
  return axios.get(`${baseUrl}/${uri}`, { auth }).then((resp) => resp.data);
};

const remove = async (uri: string) => {
  return axios.delete(`${baseUrl}/${uri}`, { auth });
};

export const getServiceSid = async (): Promise<Service> => {
  return get('Services').then((list) => list.services.find((service: Service) => service.unique_name === 'default'));
};

export const deleteEnvironments = async (serviceSid: string): Promise<void> => {
  const list = await get(`Services/${serviceSid}/Environments`);
  for (const environment of list.environments) {
    await remove(`Services/${serviceSid}/Environments/${environment.sid}`);
  }
};
