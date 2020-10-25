import requestPromise from 'request-promise';
import { IApiDef } from '../service-definition';
import { getSignatureByInput, createCertDataForRequest } from './create-cert';

export async function request<T>(options: IPostBody, privateKey: string): Promise<T> {
    const uri = 'http://' + options.to.name + options.to.route + options.route;
    const body: Object = options.body || {};
    const data = createCertDataForRequest(uri, body);
    const sign: string = getSignatureByInput(data, privateKey);
    return await requestPromise({
        uri,
        method: options.method,
        headers: {
            'Content-Type': 'application/json',
            from: options.from.name,
            authorization: sign
        },
        json: body,
    }).then<T>();
}

interface IPostBody {
    from: IApiDef;
    to: IApiDef;
    route: string;
    body?: Object;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
}
