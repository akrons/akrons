import crypto from 'crypto';

export function createCertDataForRequest(uri: string, body: Object): string {
    return JSON.stringify({ uri, body });
}

export function getSignatureByInput(input: string, privateKey: string): string {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(input, 'utf8');
    let signature: string = sign.sign(crypto.createPrivateKey({ key: privateKey, format: 'pem', type: 'pkcs8' }), 'base64');
    return signature;
}
