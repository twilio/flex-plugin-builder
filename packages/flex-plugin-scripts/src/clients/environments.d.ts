import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { Environment, EnvironmentResource } from './serverless-types';
export default class EnvironmentClient extends BaseClient {
    static BaseUri: string;
    static DomainSuffixLength: number;
    constructor(auth: Credential, serviceSid: string);
    /**
     * Returns the {@link Environment} that has the same name as the packageName
     *
     * @param create  if set to true, will create an environment if not found
     */
    get: (create?: boolean) => Promise<Environment>;
    /**
     * Creates an environment with the package name
     */
    create: () => Promise<Environment>;
    /**
     * Removes the Environment
     */
    remove: (sid: string) => Promise<void>;
    /**
     * Fetches a list of {@link Environment}
     */
    list: () => Promise<EnvironmentResource>;
}
