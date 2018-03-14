const disposableEmailBlacklist = require('./disposable-email-blacklist.json');

/**
 * Returns whether or not the given email is blacklisted because it's
 * a temporary email.
 * 
 * REQ: assuming that email is valid email
 * 
 * @param {string} email 
 */
function isEmailBlacklisted(email) {
  const emailDomain = '.' + email.split('@')[1];
  return disposableEmailBlacklist.some(domain => emailDomain.endsWith('.' + domain));
}

module.exports = isEmailBlacklisted
