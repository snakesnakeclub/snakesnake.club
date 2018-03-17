import { EventEmitter } from 'events';
import * as localforage from 'localforage';
import RestServerService from './RestServer.service';
import ServerAddress from '../models/ServerAddress';
import { AUTH_REST_SERVER } from '../credentials.json';

/**
 * Emits 'login' when user logged in.
 * 
 * Emits 'logout' when user logged out.
 */
export default class AuthService extends EventEmitter {
  session_token?: string;

  constructor() {
    super();
    localforage.getItem('session_token')
      .then(this.handleSessionTokenStorage.bind(this));
  }

  get isLoggedIn() {
    return !!this.session_token
  }

  async handleSessionTokenStorage(session_token) {
    if (!session_token) {
      return;
    }

    try {
      await this.loginToken(session_token)
    } catch (error) {
      localforage.removeItem('session_token');
    }
  }

  /**
   * Returns a promise that resolves if login succeeded and rejects if it fails. 
   * 
   * @param email is a valid email
   * @param password is a valid password
   */
  login(email: string, password: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/login', {
      email,
      password
    })
      .then(data => {
        this.session_token = data.user.session_token;
        localforage.setItem('session_token', this.session_token);
        this.emit('login');
        return data
      })
  }

  loginToken(session_token) {
    return RestServerService.post(AUTH_REST_SERVER, '/login-token', {
      session_token,
    })
      .then(data => {
        this.session_token = data.user.session_token;
        localforage.setItem('session_token', this.session_token);
        this.emit('login');
        return data
      })
  }

  register(email: string, password: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/register', {
      email,
      username: email.split('@')[0].replace(/[^\w\d]/g, ''),
      password
    })
      .then(data => {
        this.session_token = data.user.session_token;
        localforage.setItem('session_token', this.session_token);
        this.emit('login');
        return data
      })
  }

  resetPassword(email: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/reset-password', {
      email,
    })
  }

  resetVerification(email: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/reset-verification', {
      email,
    })
  }

  logout() {
    return RestServerService.post(AUTH_REST_SERVER, '/logout', {
      session_token: this.session_token,
    })
      .then(data => {
        this.session_token = null;
        localforage.removeItem('session_token');
        this.emit('logout');
        return data
      })
  }
}
