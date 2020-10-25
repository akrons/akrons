import * as json5 from "json5";
import { join, dirname, isAbsolute } from "path";
import * as fs from "fs";
import * as deepmerge from "deepmerge";
import { request } from 'https';
import { URL } from 'url';

const DEFAULT_CONFIG_IDENTIFIER = "default";

async function loadFile(path: string): Promise<string> {
    await fs.promises.access(path, fs.constants.R_OK);
    const buffer = await fs.promises.readFile(path);
    return buffer.toString();
}

function downloadFile(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let urlData = new URL(url);
        let result = "";
        const httpRequest = request(
            {
                method: 'GET',
                port: urlData.port || '443',
                hostname: urlData.hostname,
                path: urlData.pathname,
                search: urlData.search,
            },
            (res) => {
                res.on("data", data => {
                    result += data;
                });
                res.on("end", () => {
                    resolve(result);
                });
            }
        );
        httpRequest.on("error", err => {
            reject(err);
        });
        httpRequest.end();
    });
}

async function loadRessource(path: string): Promise<string> {
    if (path.startsWith("http")) {
        return downloadFile(path);
    }
    return loadFile(path);
}

function isUrl(path: string): boolean {
    try {
        return new URL(path).protocol.startsWith("http");
    } catch (_) {
        return false;
    }
}

export async function loadConfigFile(path: string, parentConfigs: string[], defaultConfig?: string): Promise<Object> {
    if (parentConfigs.includes(path)) {
        throw new Error(`Circular extensions! File ${path} was already extended: ${parentConfigs.join("->")}`);
    }
    let parentPath = parentConfigs.length ? dirname(parentConfigs[parentConfigs.length - 1]) : process.cwd();
    if (path === DEFAULT_CONFIG_IDENTIFIER) {
        if (!defaultConfig) {
            throw new Error("This process has no default config!");
        }
        path = defaultConfig;
        parentPath = process.cwd();
    }
    if (!isUrl(path) && !isUrl(parentPath) && !isAbsolute(path)) {
        path = join(parentPath, path);
    }
    if (!isUrl(path) && isUrl(parentPath) && !isAbsolute(path)) {
        path = new URL(path, parentPath).toString();
    }
    const file = await loadRessource(path);
    let result = json5.parse(file);
    const extensions: string[] = (typeof result.extends === "string" ? [result.extends] : result.extends) || [];
    result.extends = undefined;
    const nextParentConfig = [...parentConfigs, path];
    const extensionsLoaded = await Promise.all(extensions.map(extension => {
        return loadConfigFile(extension, nextParentConfig, defaultConfig);
    }));
    return extensionsLoaded.reduce((combinedConfig, extendingConfig) => deepmerge.default(extendingConfig, combinedConfig), result);
}
