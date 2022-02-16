import { Region } from '@twilio/flex-dev-utils/dist/env';
import { env, logger, HttpClient, lodash } from '@twilio/flex-dev-utils';

export interface Pagination {
  pageSize?: number;
  page?: number;
  pageToken?: string;
}

export interface Meta {
  page: number;
  page_size: number;
  first_page_url: string;
  previous_page_url: string | null;
  url: string;
  next_page_url?: string;
  key: string;
  next_token?: string;
  previous_token?: string;
}

export interface PaginationMeta {
  meta: Meta;
}

export default abstract class ServiceHttpClient extends HttpClient {
  protected static regions: Region[] = ['dev', 'stage'];

  /**
   * Returns the region if provided
   */
  protected static getRegion = (region?: Region): string => {
    if (region && ServiceHttpClient.regions.includes(region)) {
      return `.${region}`;
    }

    region = env.getRegion() as Region;
    if (!region) {
      return '';
    }

    if (!ServiceHttpClient.regions.includes(region)) {
      logger.warning('Invalid region %s was provided, returning production region', region);
      return '';
    }

    return `.${region}`;
  };

  /**
   * List API endpoint with pagination support
   * @param uri           the uri endpoint
   * @param responseKey  response key
   * @param pagination    the request option
   */
  public async list<R extends PaginationMeta>(uri: string, responseKey: string, pagination?: Pagination): Promise<R> {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => params.set(lodash.upperFirst(key), value));
    }

    const resp = await this.get<R>(`${uri}?${params.toString()}`);
    if (resp.meta.next_page_url) {
      const next = new URL(resp.meta.next_page_url);
      if (next.searchParams.has('PageToken')) {
        resp.meta.next_token = next.searchParams.get('PageToken') as string;
      }
    }
    if (resp.meta.previous_page_url) {
      const prev = new URL(resp.meta.previous_page_url);
      if (prev.searchParams.has('PageToken')) {
        resp.meta.previous_token = prev.searchParams.get('PageToken') as string;
      }
    }

    const resultKey = 'results';
    if (!resp[responseKey] && resp[resultKey]) {
      resp[responseKey] = resp[resultKey];
      delete resp[resultKey];
    }

    return resp;
  }
}
