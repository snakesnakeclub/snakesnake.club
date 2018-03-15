import ServerAddress from '../models/ServerAddress';

export default class RESTServerService {
  static get(server: ServerAddress, path: string, instantiateAs?: any): any {
    return fetch(this.serverToURL(server, path), {
      method: 'GET',
      credentials: 'same-origin',
      headers: new Headers({
        'Accepts': 'application/json'
      })
    })
      .then(res => res.json())
      .then(() => {
        instantiateAs
      })
  }

  /**
   * Builds a URL from a ServerAddress object.
   * 
   * @param server
   * @param path empty string or start with /
   * @example
   * RESTServerService.serverToURL(AUTH_REST_SERVER);
   * // => `${protocol}://${host}:${port}/${path}`
   */
  static serverToURL(server: ServerAddress, path: string) {
    return `${server.protocol}://${server.host}:${server.port}${server.path}${path}`;
  }
}
