
function getNestedEntity(nestedKey: string, args: { [key: string]: unknown }, prefix: string = ""): unknown {
    return nestedKey.split(".").reduce<unknown>((acc, val) => {
        const isObject = (acc: unknown): acc is { [key: string]: unknown } => (typeof acc === "object");
        if (!isObject(acc) || !acc![val]) {
            throw new Error(`The field ${val} from ${prefix}${nestedKey} is missing!`);
        }
        return acc[val];
    }, args);
}

export function nestedDemandOption(nestedKey: string): (args: { [key: string]: unknown }) => boolean {
    return (args): boolean => {
        getNestedEntity(nestedKey, args);
        return true;
    };
}

export function checkRequired(keys: string[]): (args: { [key: string]: unknown }) => boolean {
    return (args): boolean => {
        keys.forEach((key) => {
            nestedDemandOption(key)(args);
        });
        return true;
    };
}

export function checkSourceArray(
    nestedArrayKey: string,
    arrayOptions: Array<{ key: string; demandOption?: boolean }>
): (args: { [key: string]: unknown }) => boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (args: any): boolean => {
        const array = getNestedEntity(nestedArrayKey, args);
        if (!Array.isArray(array)) {
            throw new Error(`Expected array at '${nestedArrayKey}'!`);
        }
        for (let i = 0; i < array.length; i++) {
            arrayOptions.forEach((option) => {
                if (!option.demandOption) {
                    return;
                }
                getNestedEntity(option.key, array[i], `${nestedArrayKey}[${i}].`);
            });
        }
        return true;
    };
}
