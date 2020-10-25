import crypto from 'crypto';

/**
 * Hashes the given password with a new salt.
 *
 * @export
 * @param {string} password
 * @returns {{ hash: string, salt: string }} The hashed password and the used salt.
 */
export function hashUserPassword(password: string): { hash: string, salt: string } {
    const salt = generateSalt();
    const hash = hashUserPasswordWithSalt(password, salt);
    return {
        hash,
        salt,
    };
}

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
 * Hashes an password and salt
 *
 * @export
 * @param {string} password
 * @param {string} salt
 * @returns {string}
 */
export function hashUserPasswordWithSalt(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 100000, 128, 'sha512').toString('hex');
}
