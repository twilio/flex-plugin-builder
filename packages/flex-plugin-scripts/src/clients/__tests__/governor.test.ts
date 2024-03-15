/* eslint-disable camelcase */
import fs from 'fs';

import { Credential } from '@twilio/flex-dev-utils';

import GovernorClient from '../governor';

jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('GovernorClient', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const auth: Credential = {
    username: accountSid,
    password: 'abc',
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should upload the zip file and make the post call', async () => {
      const client = new GovernorClient(auth.username, auth.password);
      const validateResponse = {
        dom_manipulation: [
          {
            file: '/path/to/abc',
            messages: ['document.querySelector is discouraged'],
          },
        ],
        deprecated_api_usage: [],
        version_incompatibility: [],
        errors: [],
      };
      const zipFile = '/path/to/plugin-zip';

      // @ts-ignore
      const upload = jest.spyOn(client.http, 'upload').mockResolvedValue(validateResponse);
      const readStream = jest.spyOn(fs, 'createReadStream').mockReturnValue('blah' as any);

      const result = await client.validate(zipFile, 'plugin-sample', '2.5.0');

      expect(readStream).toHaveBeenCalledTimes(1);
      expect(readStream).toHaveBeenCalledWith(zipFile);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(upload).toHaveBeenCalledWith('Validate', expect.anything());
      expect(result).toEqual(validateResponse);
    });
  });
});
