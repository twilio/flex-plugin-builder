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
export declare enum GitHubContentType {
    File = "file",
    Dir = "dir"
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
export declare const ERROR_GITHUB_URL_PARSE = "Could not get owner and repo name from GitHub URL";
export declare const ERROR_BRANCH_MASTER_MAIN = "Could not find branch main or master on GitHub";
/**
 * Generates a regex for matching the download url
 * @param info {GitHubInfo} the GitHub information
 * @param hasTemplateDir {boolean} whether the GitHub repo has a template directory
 * @private
 */
export declare const _getBaseRegex: (info: GitHubInfo, hasTemplateDir: boolean) => string;
/**
 * Checks for back-ward compatible changes; returns true is the repo has a template/ directory
 * @param info {GitHubInfo}  the {@link GitHubInfo} information
 * @private
 */
export declare const _hasTemplateDir: (info: GitHubInfo) => Promise<boolean>;
/**
 * Downloads the file
 *
 * @param url {string}      the url of the file to download
 * @param output {string}   the output path
 * @private
 */
export declare const _downloadFile: (url: string, output: string) => Promise<void>;
/**
 * Recursively downloads the directory
 *
 * @param url {string}  the url to download
 * @param dir {string}  the path to the directory to save the content
 * @param baseRegex {String} the base path regex
 * @private
 */
export declare const _downloadDir: (url: string, dir: string, baseRegex: string) => Promise<void>;
/**
 * Parses the GitHub URL to extract owner and repo information
 *
 * @param url {string}  the GitHub URL
 * @return returns the {@link GitHubInfo}
 */
export declare const parseGitHubUrl: (url: string) => Promise<GitHubInfo>;
/**
 * Downloads the repo to the provided directory path
 *
 * @param info {GitHubInfo} the GitHub information
 * @param dir {string}      the directory to download the content to
 * @return null
 */
export declare const downloadRepo: (info: GitHubInfo, dir: string) => Promise<void>;
