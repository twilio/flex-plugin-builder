export interface UIDependencies {
    react?: string;
    'react-dom'?: string;
}
export interface Configuration {
    ui_version: string;
    serverless_service_sids: string[] | null;
    account_sid: string;
    ui_dependencies?: UIDependencies;
}
