import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { _downloadDir, GitHubInfo } from "../../src/utils/github";
import * as github from '../../src/utils/github';
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;


describe('github', () => {
    let mockAxios: MockAdapter;
    const gitHubUrl = 'https://github.com/twilio/flex-plugin-builder';
    const apiGithubUrl = 'https://api.github.com/repos/twilio/flex-plugin-builder/contents/template?ref=master';
    const githubInfo: GitHubInfo = {
        ref: 'master',
        owner: 'twilio',
        repo: 'flex-plugin-builder'
    };
    const mock = (key: string, mock: Mock) => {
        Object.defineProperty(github, key, {
            value: mock,
        });
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
            const resp = github.parseGitHubUrl(gitHubUrl + '/tree/some-ref');

            expect(resp.ref).toEqual('some-ref');
            expect(resp.repo).toEqual('flex-plugin-builder');
            expect(resp.owner).toEqual('twilio');
        });

        it('should fail to parse', () => {
            expect(() => github.parseGitHubUrl('/broken')).toThrow();
        })
    });

    describe('downloadRepo', () => {
        const _downloadDir = jest.fn();

        beforeEach(() => {
            _downloadDir.mockClear();
            mock('_downloadDir', _downloadDir);
        });

        afterEach(() => {
            (github._downloadDir as any).mockReset();
        });

        it('should call _downloadDir', async () => {
            await github.downloadRepo(githubInfo, '/dir');

            expect(_downloadDir).toHaveBeenCalledTimes(1);
            expect(_downloadDir).toHaveBeenCalledWith(apiGithubUrl, '/dir');
        });
    });

    describe.only('_downloadDir', () => {
        const _downloadFile = jest.fn();
        let _downloadDir: SpyInstance;

        beforeEach(() => {
            _downloadFile.mockReset();
            mock('_downloadFile', _downloadFile);

            _downloadDir = jest.spyOn(github, '_downloadDir');
        });

        afterEach(() => {
            (github._downloadFile as any).mockClear();
            _downloadDir.mockRestore();
        });

        it('should do nothing if api returns empty result', async () => {
            mockAxios.onGet().reply(() => Promise.resolve([200, []]));
            await github._downloadDir(apiGithubUrl, '/dir');

            expect(_downloadDir).toHaveBeenCalledTimes(1);
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

            expect(_downloadDir).toHaveBeenCalledTimes(1);
            expect(_downloadFile).toHaveBeenCalledTimes(2);
            expect(_downloadFile).toHaveBeenNthCalledWith(1, resp[0].download_url, '/dir/file1.js');
            expect(_downloadFile).toHaveBeenNthCalledWith(2, resp[1].download_url, '/dir/file2.js');
        });

        it('should recursively download',  async () => {
            const firstResp = [{
                type: 'dir',
                url: 'github.com/twilio'
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

            expect(_downloadDir).toHaveBeenCalledTimes(2);
            expect(_downloadFile).toHaveBeenCalledTimes(1);
            expect(_downloadFile).toHaveBeenNthCalledWith(1, secondResp[0].download_url, '/dir/file2.js');
        });
    });
});
