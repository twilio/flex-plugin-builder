import axios, { MockAdapter } from 'flex-dev-utils/dist/axios';
import * as fs from 'flex-dev-utils/dist/fs';

import * as github from '../github';

describe('github', () => {
  let mockAxios: MockAdapter;
  const gitHubUrl = 'https://github.com/twilio/flex-plugin-builder';
  const apiGithubUrl = 'https://api.github.com/repos/twilio/flex-plugin-builder/contents/template?ref=master';
  const githubInfo = {
    ref: 'master',
    owner: 'twilio',
    repo: 'flex-plugin-builder',
  };

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  describe('parseGitHubUrl', () => {
    it('should get repo and master ref', () => {
      const resp = github.parseGitHubUrl(gitHubUrl);

      expect(resp.ref).toEqual('master');
      expect(resp.repo).toEqual('flex-plugin-builder');
      expect(resp.owner).toEqual('twilio');
    });

    it('should get repo and some ref', () => {
      const resp = github.parseGitHubUrl(`${gitHubUrl}/tree/some-ref`);

      expect(resp.ref).toEqual('some-ref');
      expect(resp.repo).toEqual('flex-plugin-builder');
      expect(resp.owner).toEqual('twilio');
    });

    it('should fail to parse', () => {
      expect(() => github.parseGitHubUrl('/broken')).toThrow();
    });
  });

  describe('downloadRepo', () => {
    it('should call _downloadDir', async () => {
      const _downloadDir = jest
        .spyOn(github, '_downloadDir')
        .mockResolvedValue(null);

      await github.downloadRepo(githubInfo, '/dir');

      expect(_downloadDir).toHaveBeenCalledTimes(1);
      expect(_downloadDir).toHaveBeenCalledWith(apiGithubUrl, '/dir');

      _downloadDir.mockRestore();
    });
  });

  describe('_downloadDir', () => {
    const _downloadFile = jest
      .spyOn(github, '_downloadFile')
      .mockResolvedValue(undefined);

    afterAll(() => {
      _downloadFile.mockRestore();
    });

    beforeEach(() => {
      _downloadFile.mockReset();
    });

    it('should do nothing if api returns empty result', async () => {
      mockAxios.onGet().reply(() => Promise.resolve([200, []]));
      await github._downloadDir(apiGithubUrl, '/dir');

      expect(_downloadFile).not.toHaveBeenCalled();
    });

    it('should download files', async () => {
      const resp = [{
        type: 'file',
        download_url: 'github.com/twilio/template/file1.js',
      }, {
        type: 'file',
        download_url: 'github.com/twilio/template/file2.js',
      }];

      mockAxios.onGet().reply(() => Promise.resolve([200, resp]));
      await github._downloadDir(apiGithubUrl, '/dir');

      expect(_downloadFile).toHaveBeenCalledTimes(2);
      expect(_downloadFile).toHaveBeenNthCalledWith(1, resp[0].download_url, '/dir/file1.js');
      expect(_downloadFile).toHaveBeenNthCalledWith(2, resp[1].download_url, '/dir/file2.js');
    });

    it('should recursively download', async () => {
      const firstResp = [{
        type: 'dir',
        url: 'github.com/twilio',
      }];
      const secondResp = [{
        type: 'file',
        download_url: 'github.com/twilio/template/file2.js',
      }];

      mockAxios.onGet().reply((request) => {
        if (request.url === apiGithubUrl) {
          return Promise.resolve([200, firstResp]);
        } else {
          return Promise.resolve([200, secondResp]);
        }
      });
      await github._downloadDir(apiGithubUrl, '/dir');

      expect(_downloadFile).toHaveBeenCalledTimes(1);
      expect(_downloadFile).toHaveBeenNthCalledWith(1, secondResp[0].download_url, '/dir/file2.js');
    });

    it('should throw error if type is not a file', async (done) => {
      const resp = [{
        type: 'foo',
        download_url: 'github.com/twilio/template/file1.js',
      }];

      mockAxios.onGet().reply(() => Promise.resolve([200, resp]));

      try {
        await github._downloadDir(apiGithubUrl, '/dir');
      } catch (e) {
        expect(e.message).toContain('Unexpected content type');
        done();
      }
    });

    it('should throw error if url is incorrect', async (done) => {
      const resp = [{
        type: 'file',
        download_url: 'broken-url/file1.js',
      }];

      mockAxios.onGet().reply(() => Promise.resolve([200, resp]));

      try {
        await github._downloadDir(apiGithubUrl, '/dir');
      } catch (e) {
        expect(e.message).toContain('invalid URL');
        done();
      }
    });
  });

  describe('_downloadFile', () => {
    it('should call request', async () => {
      const result = { data: 'the-data' };
      const writeFileSync = jest
        .spyOn(fs.default, 'writeFileSync')
        .mockReturnValue(undefined);
      const mkdirpSync = jest
        .spyOn(fs, 'mkdirpSync')
        .mockReturnValue(null);
      const request = jest
        .spyOn(axios, 'request')
        .mockResolvedValue(result);

      await github._downloadFile('the-url', 'the-output');

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        responseType: 'arraybuffer',
        url: 'the-url',
      });
      expect(mkdirpSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('the-output', 'the-data');

      writeFileSync.mockRestore();
      mkdirpSync.mockRestore();
      request.mockRestore();
    });
  });
});
