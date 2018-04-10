import isEmail from 'validator/lib/isEmail';
import isAlpha from 'validator/lib/isAlpha';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import Skin, {defaultSkin} from './Skin';

export default class User {
  public email: string;
  public username: string;
  public balance: number;
  public takedowns: number;
  public verified: boolean;
  public session_token?: string;
  public active_skin: Skin;
  public owned_skins: Array<Skin>;

  /**
   * @param user.email 
   * @param user.username 
   * @param user.balance 
   * @param user.takedowns 
   * @param user.verified 
   * @param user.session_token
   * @param user.active_skin
   * @param user.owned_skins
   */
  constructor(user) {
    this.email = user.email;
    this.username = user.username;
    this.balance = user.balance;
    this.takedowns = user.takedowns;
    this.verified = user.verified;
    this.session_token = user.session_token;
    this.active_skin = user.active_skin ? new Skin(user.active_skin) : defaultSkin;
    this.owned_skins = user.owned_skins.map(skin => new Skin(skin));
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
