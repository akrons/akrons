import crypto from 'crypto';
import express from 'express';
import url from 'url';
import { createCertDataForRequest } from './create-cert';
import { RequestHandler } from 'express-serve-static-core';

function fullUrl(req: express.Request): string {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });
}

export function verifyServiceAuthentication(publicKeys: { service: string, publicKey: string }[]): RequestHandler {
    return (req, res, next) => {
        const auth = req.headers['authorization'];
        const fromService = req.headers['from'];
        const reqestBody = req.body;
        const data = createCertDataForRequest(fullUrl(req), reqestBody);
        if (fromService && auth && verifySign(data, auth, getPublicKeyForService(fromService, publicKeys))) {
            next();
        } else {
            return res.sendStatus(401);
        }
    };
}

export function getPublicKeyForService(service: string, publicKeys: { service: string; publicKey: string; }[]): string {
    const publicKey = publicKeys.find(x => x.service === service);
    if(!publicKey) throw new Error(`No public key found for service ${service}`);
    return publicKey.publicKey;
}

export function verifySign(input: string, signature: string, publicKey: string): boolean {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(input, 'utf8');
    const result = verifier.verify(crypto.createPublicKey({ key: publicKey, format: 'pem', type: 'spki' }), signature, 'base64');
    return result;
}
