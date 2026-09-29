export interface Warning {
    file: string;
    warnings: {
        id: string;
        name: string;
        warningMessage: string;
        location?: {
            line: number;
            column: number;
        };
        recommendation: {
            code?: string;
            message: string;
            link?: string;
        };
    }[];
}
interface GenericWarning {
    file: string;
    messages: string[];
}
interface Error {
    file: string;
    message: string;
}
export interface ValidateReport {
    request_id: string;
    dom_manipulation: GenericWarning[];
    api_compatibility: Warning[];
    version_compatibility: Warning[];
    errors: Error[];
}
export default class GovernorClient {
    private static version;
    private readonly http;
    constructor(username: string, password: string);
    /**
     * Returns the {@link ValidateReport}
     */
    validate: (pluginZip: string, pluginName: string, flexUIVersion: string) => Promise<ValidateReport>;
}
export {};
