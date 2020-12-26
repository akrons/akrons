import * as crypto from 'crypto';

export function verifySign(input: string, signature: string, publicKey: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(input, 'utf8');
    const result = verifier.verify(crypto.createPublicKey({ key: publicKey, format: 'pem', type: 'spki' }), signature, 'base64');
    return result;
}
