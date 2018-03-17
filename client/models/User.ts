import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';
import isAlphanumeric from 'validator/lib/isAlphanumeric';

export default class User {
  private email: string;
  private username: string;
  private balance: number;
  private takedowns: number;
  private verified: boolean;

  /**
   * @param email 
   * @param username 
   * @param balance 
   * @param takedowns 
   * @param verified 
   */
  constructor(
    email: string,
    username: string,
    balance: number,
    takedowns: number,
    verified: boolean) {

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