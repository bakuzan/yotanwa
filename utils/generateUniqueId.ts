import crypto from 'crypto';

export default function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}
