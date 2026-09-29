import ServerlessClient from './serverless-client';
import FileClient from './files';
export declare enum Visibility {
    Public = "public",
    Protected = "protected"
}
export interface ServerlessFileVersion {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
    visibility: Visibility;
    service_sid: string;
    path: string;
}
export interface FunctionVersion extends ServerlessFileVersion {
    function_sid: string;
}
export interface AssetVersion extends ServerlessFileVersion {
    asset_sid: string;
}
export default class AssetClient extends FileClient {
    constructor(client: ServerlessClient, serviceSid: string);
}
