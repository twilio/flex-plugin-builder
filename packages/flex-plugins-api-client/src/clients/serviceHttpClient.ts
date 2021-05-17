import upperFirst from 'lodash.upperfirst';
import { Realm, env } from 'flex-plugins-utils-env';
import { logger } from 'flex-plugins-utils-logger';
import { HttpClient } from 'flex-plugin-utils-http';

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
  protected static realms: Realm[] = ['dev', 'stage'];

  /**
   * Returns the realm if provided
   */
  protected static getRealm = (realm?: Realm): string => {
    if (realm && ServiceHttpClient.realms.includes(realm)) {
      return `.${realm}`;
    }

    realm = env.getRealm() as Realm;
    if (!realm) {
      return '';
    }

    if (!ServiceHttpClient.realms.includes(realm)) {
      logger.warning('Invalid realm %s was provided, returning production realm', realm);
      return '';
    }

    return `.${realm}`;
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
      Object.entries(pagination).forEach(([key, value]) => params.set(upperFirst(key), value));
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
