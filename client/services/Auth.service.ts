import { EventEmitter } from 'events';
import * as localforage from 'localforage';
import RestServerService from './RestServer.service';
import ServerAddress from '../models/ServerAddress';
import User from '../models/User';
const {AUTH_REST_SERVER} = require('../credentials.json');

/**
 * Emits 'login' when user logged in.
 * 
 * Emits 'logout' when user logged out.
 */
export default class AuthService extends EventEmitter {
  public user: User = null;

  constructor() {
    super();
    localforage.getItem('session_token')
      .then(this.handleSessionTokenStorage.bind(this))
      .then(this.handleReady.bind(this));
  }

  /**
   * Returns whether or not there is a session.
   */
  get isLoggedIn() {
    return this.user && this.user.session_token
  }

  /**
   * Tries to login with the session token, if it fails, it is deleted from
   * storage.
   * 
   * @param session_token
   */ 
  async handleSessionTokenStorage(session_token: string) {
    if (!session_token) {
      return;
    }

    try {
      await this.loginToken(session_token);
    } catch (error) {
      localforage.removeItem('session_token');
    }
  }

  /**
   * Auth service finished reading from storage and signed in if there
   * is a session_token.
   * 
   * Emits 'ready'.
   */
  handleReady() {
    this.emit('ready');
  }

  /**
   * Starts a new session for a given user. 
   * 
   * Emits 'login'.
   * 
   * @param user 
   */
  handleStartSession(user: object) {
    this.user = new User(user);
    localforage.setItem('session_token', this.user.session_token);
    this.emit('login', this.user);
  }

  /**
   * Ends the session.
   * 
   * Emits 'logout'.
   */
  handleEndSession() {
    this.user = null;
    localforage.removeItem('session_token');
    this.emit('logout');
  }

  /**
   * Returns a promise that resolves if login succeeded and rejects if it fails. 
   * 
   * @param email is a valid email or username
   * @param password is a valid password
   */
  login(email: string, password: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/login', {
      email,
      password
    })
      .then((data) => this.handleStartSession(data.user))
  }

  /**
   * Returns a promise that resolves if login succeeded and rejects if it fails.
   * 
   * @param session_token 
   */
  loginToken(session_token: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, '/login-token', {
      session_token,
    })
      .then((data) => this.handleStartSession(data.user))
  }

  /**
   * Returns a promise that resolves if register succeeded and rejects if it fails.
   * 
   * @param recaptchaValue
   * @param email is a valid email or username
   * @param username is a valid username
   * @param password is a valid password
   */
  register(recaptchaValue: string, email: string, username: string, password: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, `/register?g-recaptcha-response=${recaptchaValue}`, {
      email,
      username,
      password
    })
      .then((data) => this.handleStartSession(data.user))
  }

  /**
   * Returns a promise that resolves if reset password succeeded and rejects
   * if it fails.
   * 
   * @param recaptchaValue
   * @param email is a valid email or username
   */
  resetPassword(recaptchaValue: string, email: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, `/reset-password?g-recaptcha-response=${recaptchaValue}`, {
      email,
    })
  }

  /**
   * Returns a promise that resolves if reset verification succeeded and rejects
   * if it fails.
   * 
   * @param recaptchaValue
   * @param email is a valid email or username
   */
  resetVerification(recaptchaValue: string, email: string): Promise<any> {
    return RestServerService.post(AUTH_REST_SERVER, `/reset-verification?g-recaptcha-response=${recaptchaValue}`, {
      email,
    })
  }

  /**
   * Returns a promise that resolves if logout succeeded and rejects if it fails.
   */
  logout = () => {
    return RestServerService.post(AUTH_REST_SERVER, '/logout', {
      session_token: this.user.session_token,
    })
      .then(this.handleEndSession.bind(this))
  }
}
