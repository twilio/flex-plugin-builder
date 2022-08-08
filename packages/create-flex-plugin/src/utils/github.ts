/* eslint-disable camelcase */
import path from 'path';

import { HttpClient } from '@twilio/flex-dev-utils';

export interface GitHubInfo {
  owner: string;
  repo: string;
  ref: string;
}

export interface GitHubBranches {
  name: string;
  commit: string;
  protected: boolean;
}

export enum GitHubContentType {
  File = 'file',
  Dir = 'dir',
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: GitHubContentType;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export const ERROR_GITHUB_URL_PARSE = 'Could not get owner and repo name from GitHub URL';
export const ERROR_BRANCH_MASTER_MAIN = 'Could not find branch main or master on GitHub';

/**
 * Generates a regex for matching the download url
 * @param info {GitHubInfo} the GitHub information
 * @param hasTemplateDir {boolean} whether the GitHub repo has a template directory
 * @private
 */
export const _getBaseRegex = (info: GitHubInfo, hasTemplateDir: boolean): string => {
  const baseRegex = `\/${info.owner}\/${info.repo}\/${info.ref}\/`;
  if (hasTemplateDir) {
    return `${baseRegex}template\/`;
  }

  return baseRegex;
};

/**
 * Checks for back-ward compatible changes; returns true is the repo has a template/ directory
 * @param info {GitHubInfo}  the {@link GitHubInfo} information
 * @private
 */
export const _hasTemplateDir = async (info: GitHubInfo): Promise<boolean> => {
  const url = `https://api.github.com/repos/${info.owner}/${info.repo}/contents?ref=${info.ref}`;

  return HttpClient.get<GitHubContent[]>(url).then((contents) =>
    contents.some((content) => content.name === 'template' && content.type === 'dir'),
  );
};

/**
 * Downloads the file
 *
 * @param url {string}      the url of the file to download
 * @param output {string}   the output path
 * @private
 */
export const _downloadFile = async (url: string, output: string): Promise<void> => {
  return HttpClient.download(url, output);
};

/**
 * Recursively downloads the directory
 *
 * @param url {string}  the url to download
 * @param dir {string}  the path to the directory to save the content
 * @param baseRegex {String} the base path regex
 * @private
 */
export const _downloadDir = async (url: string, dir: string, baseRegex: string): Promise<void> => {
  return HttpClient.get<GitHubContent[]>(url).then(async (contents) => {
    const promises = contents.map(async (content) => {
      if (content.type === GitHubContentType.Dir) {
        return _downloadDir(content.url, dir, baseRegex);
      }

      if (content.type !== GitHubContentType.File) {
        throw new Error(`Unexpected content type ${content.type}`);
      }

      const regex = new RegExp(`${baseRegex}(.+)\\??`);
      const relativePath = content.download_url.match(regex);
      if (!relativePath || relativePath.length !== 2) {
        throw new Error('Received invalid URL template');
      }
      const output = path.resolve(dir, relativePath[1]);

      return _downloadFile(content.download_url, output);
    });

    await Promise.all(promises);
  });
};

/**
 * Parses the GitHub URL to extract owner and repo information
 *
 * @param url {string}  the GitHub URL
 * @return returns the {@link GitHubInfo}
 */
export const parseGitHubUrl = async (url: string): Promise<GitHubInfo> => {
  const matches = url.match(/github\.com\/([0-9a-zA-Z-_]+)\/([0-9a-zA-Z-_]+)(\/tree\/([0-9a-zA-Z._-]+))?/);

  if (!matches || matches.length < 3) {
    throw new Error(ERROR_GITHUB_URL_PARSE);
  }

  const info: GitHubInfo = {
    owner: matches[1],
    repo: matches[2],
    ref: matches[4] || 'master',
  };

  // Check whether master or main exists
  if (info.ref === 'master' || info.ref === 'main') {
    const branches = await HttpClient.get<GitHubBranches[]>(
      `https://api.github.com/repos/${info.owner}/${info.repo}/branches`,
    );
    const hasMaster = branches.find((branch) => branch.name === 'master');
    const hasMain = branches.find((branch) => branch.name === 'main');

    if (hasMain) {
      info.ref = 'main';
    } else if (hasMaster) {
      info.ref = 'master';
    } else {
      throw new Error(ERROR_BRANCH_MASTER_MAIN);
    }
  }

  return info;
};

/**
 * Downloads the repo to the provided directory path
 *
 * @param info {GitHubInfo} the GitHub information
 * @param dir {string}      the directory to download the content to
 * @return null
 */
export const downloadRepo = async (info: GitHubInfo, dir: string): Promise<void> => {
  const hasTemplateDir = await _hasTemplateDir(info);

  const url = hasTemplateDir
    ? `https://api.github.com/repos/${info.owner}/${info.repo}/contents/template?ref=${info.ref}`
    : `https://api.github.com/repos/${info.owner}/${info.repo}/contents?ref=${info.ref}`;

  return _downloadDir(url, dir, _getBaseRegex(info, hasTemplateDir));
};
