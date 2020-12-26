import { promises, existsSync } from 'fs';
import axios from 'axios';

export async function loadD4sKey(path: string, d4s: string | undefined, privateKey: boolean, issuer: string, serviceName: string): Promise<string> {
    if (existsSync(path)) {
        return await (await promises.readFile(path)).toString();
    }
    if(!d4s) {
        throw new Error(`Key ${path} was not found and D4s is not configured!`);
    }
    axios.put(d4s + (privateKey ? '/privatekey' : '/publickey/' + serviceName), { issuer: issuer })
    console.log(`requested ${privateKey ? 'privateKey' : 'publicKey'} from d4s for service "${privateKey ? issuer : serviceName}"!`);
    process.exit(0);
}
