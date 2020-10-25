import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { getEnvironment } from '../env';

export const keys = {
    privateKey: '',
    publicKey: '',
}

export async function loadKeys(): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(getEnvironment().PUBLIC_KEY_FILE_PATH) && fs.existsSync(getEnvironment().PRIVATE_KEY_FILE_PATH)) {
                keys.publicKey = fs.readFileSync(getEnvironment().PUBLIC_KEY_FILE_PATH).toString();
                keys.privateKey = fs.readFileSync(getEnvironment().PRIVATE_KEY_FILE_PATH).toString();
                resolve();
                return;
            }
            crypto.generateKeyPair('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, async (err, newPublicKey, newPrivateKey) => {
                try {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    await ensureDir(path.dirname(getEnvironment().PUBLIC_KEY_FILE_PATH));
                    await ensureDir(path.dirname(getEnvironment().PRIVATE_KEY_FILE_PATH));
                    fs.writeFileSync(getEnvironment().PUBLIC_KEY_FILE_PATH, newPublicKey, { encoding: 'utf-8' });
                    fs.writeFileSync(getEnvironment().PRIVATE_KEY_FILE_PATH, newPrivateKey, { encoding: 'utf-8' });
                    keys.publicKey = newPublicKey;
                    keys.privateKey = newPrivateKey;
                    resolve();
                    return;
                } catch (err) {
                    reject(err);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function ensureDir(dirName: string): Promise<void> {
    if (!fs.existsSync(dirName)) {
        await fs.promises.mkdir(dirName)
    }
}
