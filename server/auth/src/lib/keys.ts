import { loadD4sKey } from '@akrons/service-utils';
import { Environment } from './env';

export class Keys {
    private static instance: Keys | undefined;
    private constructor(
        public privateKey: string,
        public publicKey: string,
    ) { }
    public static async loadKeys(): Promise<Keys> {
        Keys.instance = new Keys(
            await loadD4sKey(Environment.get().privateKeyPath, Environment.get().d4s, true, Environment.get().serviceName, ''),
            await loadD4sKey(Environment.get().publicKeyPath, Environment.get().d4s, false, Environment.get().serviceName, Environment.get().serviceName),
        );
        return Keys.instance;
    }
    public static get(): Keys {
        if (!Keys.instance) {
            throw new Error(`Keys are not initialized. Please call loadKeys() first!`);
        }
        return Keys.instance;
    }
}
