import { EventEmitter } from 'events';

/**
 * Emits 'login' when user logged in.
 * 
 * Emits 'logout' when user logged out.
 */
export default class AuthService extends EventEmitter {
  constructor() {
    super();
  }


}
