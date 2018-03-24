import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';
import isAlphanumeric from 'validator/lib/isAlphanumeric';

export default class User {
  public email: string;
  public username: string;
  public balance: number;
  public takedowns: number;
  public verified: boolean;
  public session_token?: string;

  /**
   * @param email 
   * @param username 
   * @param balance 
   * @param takedowns 
   * @param verified 
   * @param session_token
   */
  constructor(user) {
    this.email = user.email
    this.username = user.username
    this.balance = user.balance
    this.takedowns = user.takedowns
    this.verified = user.verified
    this.session_token = user.session_token
  }

  /**
   * Returns whether or not `email` is valid.
   * 
   * @param email
   * @returns true if email is valid, false otherwise.
   */
  public static
  isValidEmail(email: string): boolean {
    return isEmail(email);
  }

  /**
   * Returns whether or not `username` is valid.
   * 
   * @param username
   * @returns true if username is valid, false otherwise.
   */
  public static
  isValidUsername(username: string): boolean {
    return username.length >= 3
      && username.length <= 25
      // Starts with a letter
      && isAlpha(username[0])
      // Only contains letters and numbers
      && isAlphanumeric(username);
  }
}
