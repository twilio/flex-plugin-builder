export declare enum FileVisibility {
    Public = "Public",
    Protected = "Protected"
}
export declare enum Visibility {
    Public = "public",
    Protected = "protected"
}
export declare enum BuildStatus {
    Building = "building",
    Completed = "completed",
    Failed = "failed"
}
export interface Meta<Key> {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url?: string;
    url: string;
    next_page_url?: string;
    key: Key;
}
export interface Resource<Key> {
    meta: Meta<Key>;
}
interface ServerlessEntity {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
}
export interface Service extends ServerlessEntity {
    unique_name: string;
    include_credentials: boolean;
    friendly_name: string;
    links: {
        functions: string;
        assets: string;
        environments: string;
        builds: string;
    };
}
export interface Environment extends ServerlessEntity {
    unique_name: string;
    domain_suffix: string;
    domain_name: string;
    build_sid: string;
    service_sid: string;
}
export interface File extends ServerlessEntity {
    friendly_name: string;
    service_sid: string;
}
export interface Asset extends File {
    links: {
        asset_versions: string;
    };
}
export interface ServiceResource extends Resource<'services'> {
    services: Service[];
}
export interface EnvironmentResource extends Resource<'environments'> {
    environments: Environment[];
}
export interface Version extends ServerlessEntity {
    visibility: Visibility;
    service_sid: string;
    path: string;
}
export interface AssetVersion extends Version {
    asset_sid: string;
}
export interface FunctionVersion extends Version {
    function_sid: string;
}
export interface Build extends ServerlessEntity {
    status: BuildStatus;
    asset_versions: AssetVersion[];
    function_versions: FunctionVersion[];
    dependencies: object;
    service_sid: string;
}
export interface Deployment extends ServerlessEntity {
    service_sid: string;
    environment_sid: string;
    build_sid: string;
}
export interface Runtime {
    service: Service;
    environment?: Environment;
    build?: Build;
}
export {};
