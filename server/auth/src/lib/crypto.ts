import crypto from 'crypto';

/**
 * Returns an new randomly generated salt.
 *
 * @export
 * @param {number} [size=128]
 * @returns {string}
 */
export function generateSalt(size: number = 128): string {
    return crypto.randomBytes(size).toString('base64');
}

/**
 * Returns an new randomly generated string.
 *
 * @export
 * @param {number} [size=128]
 * @returns {string}
 */
export function generateRandomHexString(size: number = 128): string {
    return crypto.randomBytes(size).toString('hex');
}

/**
 * Hashes an password and salt
 *
 * @export
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
export function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100000, 128, 'sha512').toString('hex');
}



export function sign(input: string, privateKey: string): string {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(input, 'utf8');
    let signature: string = sign.sign(crypto.createPrivateKey({ key: privateKey, format: 'pem', type: 'pkcs8' }), 'base64');
    return signature;
}
