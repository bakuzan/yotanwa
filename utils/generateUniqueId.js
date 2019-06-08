const crypto = require('crypto');

module.exports = function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
};
