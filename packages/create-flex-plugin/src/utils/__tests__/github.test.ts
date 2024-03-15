/* eslint-disable camelcase */
import { HttpClient } from '@twilio/flex-dev-utils';
import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';

import * as github from '../github';

describe('github', () => {
  const org = 'twilio';
  const branch = 'master';
  const repo = 'flex-plugin-builder';
  const gitHubUrl = 'https://github.com/twilio/flex-plugin-builder';
  const apiGithubUrlTemplated = 'https://api.github.com/repos/twilio/flex-plugin-builder/contents/template?ref=master';
  const apiGithubUrl = 'https://api.github.com/repos/twilio/flex-plugin-builder/contents?ref=master';
  const githubInfo = {
    ref: branch,
    owner: org,
    repo,
  };

  const paths = {
    app: { name: 'plugin-test' },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('parseGitHubUrl', () => {
    const anotherBranch = 'feature-branch';
    const branchesWithMaster = [{ name: branch }, { name: anotherBranch }];
    const branchesWithMain = [{ name: 'main' }, { name: anotherBranch }];
    const branchesWithNeither = [{ name: 'something-else' }, { name: anotherBranch }];

    it('should get repo with master ref', async () => {
      jest.spyOn(HttpClient, 'get').mockResolvedValue(branchesWithMaster);
      const resp = await github.parseGitHubUrl(gitHubUrl);

      expect(resp.ref).toEqual(branch);
      expect(resp.repo).toEqual(repo);
      expect(resp.owner).toEqual(org);
    });

    it('should get repo with main ref', async () => {
      jest.spyOn(HttpClient, 'get').mockResolvedValue(branchesWithMain);
      const resp = await github.parseGitHubUrl(gitHubUrl);

      expect(resp.ref).toEqual('main');
      expect(resp.repo).toEqual(repo);
      expect(resp.owner).toEqual(org);
    });

    it('should reject because main/main is not found', async (done) => {
      jest.spyOn(HttpClient, 'get').mockResolvedValue(branchesWithNeither);
      try {
        await github.parseGitHubUrl(gitHubUrl);
      } catch (e) {
        expect(e.message).toEqual(github.ERROR_BRANCH_MASTER_MAIN);
        done();
      }
    });

    it('should get repo and some ref', async () => {
      const resp = await github.parseGitHubUrl(`${gitHubUrl}/tree/some-ref`);

      expect(resp.ref).toEqual('some-ref');
      expect(resp.repo).toEqual(repo);
      expect(resp.owner).toEqual(org);
    });

    it('should fail to parse', async (done) => {
      try {
        await github.parseGitHubUrl('/broken');
      } catch (e) {
        expect(e.message).toEqual(github.ERROR_GITHUB_URL_PARSE);
        done();
      }
    });
  });

  describe('downloadRepo', () => {
    it('should call _downloadDir with a templated url', async () => {
      const _downloadDir = jest.spyOn(github, '_downloadDir').mockResolvedValue();
      const _hasTemplateDir = jest.spyOn(github, '_hasTemplateDir').mockResolvedValue(true);

      await github.downloadRepo(githubInfo, '/dir');

      expect(_hasTemplateDir).toHaveBeenCalledTimes(1);
      expect(_hasTemplateDir).toHaveBeenCalledWith(githubInfo);

      expect(_downloadDir).toHaveBeenCalledTimes(1);
      expect(_downloadDir).toHaveBeenCalledWith(apiGithubUrlTemplated, '/dir', github._getBaseRegex(githubInfo, true));

      _downloadDir.mockRestore();
      _hasTemplateDir.mockRestore();
    });

    it('should call _downloadDir with a normal url', async () => {
      const _downloadDir = jest.spyOn(github, '_downloadDir').mockResolvedValue();
      const _hasTemplateDir = jest.spyOn(github, '_hasTemplateDir').mockResolvedValue(false);

      await github.downloadRepo(githubInfo, '/dir');

      expect(_hasTemplateDir).toHaveBeenCalledTimes(1);
      expect(_hasTemplateDir).toHaveBeenCalledWith(githubInfo);

      expect(_downloadDir).toHaveBeenCalledTimes(1);
      expect(_downloadDir).toHaveBeenCalledWith(apiGithubUrl, '/dir', github._getBaseRegex(githubInfo, false));

      _downloadDir.mockRestore();
      _hasTemplateDir.mockRestore();
    });
  });

  describe('_getBaseRegex', () => {
    it('should return a templated base regex', () => {
      const regex = github._getBaseRegex(githubInfo, true);
      expect(regex).toEqual('/twilio/flex-plugin-builder/master/template/');
    });

    it('should return a non-templated base regex', () => {
      const regex = github._getBaseRegex(githubInfo, false);
      expect(regex).toEqual('/twilio/flex-plugin-builder/master/');
    });
  });

  describe('_hasTemplateDir', () => {
    it('should return true if there is a template dir', async () => {
      const resp = [
        {
          name: 'foo',
        },
        {
          name: 'template',
          type: 'dir',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      expect(await github._hasTemplateDir(githubInfo)).toEqual(true);
    });

    it('should return false if there is a template file', async () => {
      const resp = [
        {
          name: 'foo',
        },
        {
          name: 'template',
          type: 'file',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      expect(await github._hasTemplateDir(githubInfo)).toEqual(false);
    });

    it('should return false if there is no template dir', async () => {
      const resp = [
        {
          name: 'foo',
        },
        {
          name: 'something-else',
          type: 'dir',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      expect(await github._hasTemplateDir(githubInfo)).toEqual(false);
    });
  });

  describe('_downloadDir', () => {
    const githubUrl = 'github.com/twilio/template/';
    const _downloadFile = jest.spyOn(github, '_downloadFile').mockResolvedValue(undefined);

    afterAll(() => {
      _downloadFile.mockRestore();
    });

    beforeEach(() => {
      _downloadFile.mockReset();
    });

    it('should do nothing if api returns empty result', async () => {
      jest.spyOn(HttpClient, 'get').mockResolvedValue([]);
      await github._downloadDir(apiGithubUrlTemplated, '/dir', '');

      expect(_downloadFile).not.toHaveBeenCalled();
    });

    it('should download files', async () => {
      const resp = [
        {
          type: 'file',
          download_url: 'github.com/twilio/template/file1.js',
        },
        {
          type: 'file',
          download_url: 'github.com/twilio/template/file2.js',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      await github._downloadDir(apiGithubUrlTemplated, '/dir', githubUrl);

      expect(_downloadFile).toHaveBeenCalledTimes(2);
      expect(_downloadFile).toHaveBeenNthCalledWith(1, resp[0].download_url, expect.toMatchPath('/dir/file1.js'));
      expect(_downloadFile).toHaveBeenNthCalledWith(2, resp[1].download_url, expect.toMatchPath('/dir/file2.js'));
    });

    it('should recursively download', async () => {
      const firstResp = [
        {
          type: 'dir',
          url: 'github.com/twilio',
        },
      ];
      const secondResp = [
        {
          type: 'file',
          download_url: 'github.com/twilio/template/file2.js',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockImplementation(async (url) => {
        if (url === apiGithubUrlTemplated) {
          return Promise.resolve(firstResp);
        }

        return Promise.resolve(secondResp);
      });

      await github._downloadDir(apiGithubUrlTemplated, '/dir', githubUrl);

      expect(_downloadFile).toHaveBeenCalledTimes(1);
      expect(_downloadFile).toHaveBeenNthCalledWith(1, secondResp[0].download_url, expect.toMatchPath('/dir/file2.js'));
    });

    it('should throw error if type is not a file', async (done) => {
      const resp = [
        {
          type: 'foo',
          download_url: 'github.com/twilio/template/file1.js',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      try {
        await github._downloadDir(apiGithubUrlTemplated, '/dir', githubUrl);
      } catch (e) {
        expect(e.message).toContain('Unexpected content type');
        done();
      }
    });

    it('should throw error if url is incorrect', async (done) => {
      const resp = [
        {
          type: 'file',
          download_url: 'broken-url/file1.js',
        },
      ];
      jest.spyOn(HttpClient, 'get').mockResolvedValue(resp);

      try {
        await github._downloadDir(apiGithubUrlTemplated, '/dir', 'github.com/twilio/template/');
      } catch (e) {
        expect(e.message).toContain('invalid URL');
        done();
      }
    });
  });

  describe('_downloadFile', () => {
    it('should call request', async () => {
      const download = jest.spyOn(HttpClient, 'download').mockReturnThis();
      await github._downloadFile('the-url', 'the-output');

      expect(download).toHaveBeenCalledTimes(1);
      expect(download).toHaveBeenCalledWith('the-url', 'the-output');

      download.mockRestore();
    });
  });
});
