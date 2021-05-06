import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';

export interface ReleaseResource {
  sid: string;
  account_sid: string;
  configuration_sid: string;
  date_created: string;
}

const RESPONSE_KEY = 'releases';

export interface ReleaseResourcePage extends PaginationMeta {
  [RESPONSE_KEY]: ReleaseResource[];
}

export interface CreateReleaseResource {
  ConfigurationId: string;
}

/**
 * Plugin Releases Client Public API Http client for the Release resource
 * @url https://www.twilio.com/docs/flex/plugins/api/release
 */
export default class ReleasesClient {
  private readonly client: ServiceHttpClient;

  constructor(client: ServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for Releases
   * @param releaseId    the release identifier
   */
  private static getUrl(releaseId?: string) {
    if (releaseId) {
      return `Releases/${releaseId}`;
    }

    return 'Releases';
  }

  /**
   * Fetches the list of {@link ReleaseResourcePage}
   * @param pagination the pagination meta data
   */
  public async list(pagination?: Pagination): Promise<ReleaseResourcePage> {
    return this.client.list<ReleaseResourcePage>(ReleasesClient.getUrl(), RESPONSE_KEY, pagination);
  }

  /**
   * Fetches the active {@link ReleaseResource}
   */
  public async active(): Promise<ReleaseResource | null> {
    /*
     * While we do have Releases/Active, JWE grants do not support non Sid lookup
     * So we need to fetch list and return first entry
     */
    const list = await this.list();

    return list.releases[0];
  }

  /**
   * Fetches an instance of the {@link ReleaseResource}
   * @param releaseId the release identifier
   */
  public async get(releaseId: string): Promise<ReleaseResource> {
    return this.client.get<ReleaseResource>(ReleasesClient.getUrl(releaseId), { cacheable: true });
  }

  /**
   * Creates a new {@link ReleaseResource}
   * @param object the {@link CreateReleaseResource} request
   */
  public async create(object: CreateReleaseResource): Promise<ReleaseResource> {
    return this.client.post<ReleaseResource>(ReleasesClient.getUrl(), object);
  }
}
