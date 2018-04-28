import ServerAddress from '../models/ServerAddress';

export default class RestServerService {
  static get(server: ServerAddress, path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(this.serverToURL(server, path), {
        method: 'GET',
        credentials: 'same-origin',
        headers: new Headers({
          'Accepts': 'application/json'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            reject(data)
            return
          }
          resolve(data)
        })
        .catch(error => {
          reject({
            code: 'FETCH_FAILED',
            rawError: error
          })
        })
    })
  }
  
  static post(server: ServerAddress, path: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(this.serverToURL(server, path), {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Accepts': 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            reject(data)
            return
          }
          resolve(data)
        })
        .catch(error => {
          reject({
            code: 'FETCH_FAILED',
            rawError: error
          })
        })
    })
  }

  /**
   * Builds a URL from a ServerAddress any.
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
