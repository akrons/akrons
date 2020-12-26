export function hasPermission(requiredPerission: string, permissions: string[]): boolean {
    if (!requiredPerission) {
        throw new Error('hasPermission failed; requiredPerission is Empty!');
    }
    if (!permissions) { // undefined or empty string are no permissions
        return false;
    }
    for (let permission of permissions) {
        if (!permission) { // undefined or empty string are no permissions
            continue;
        }
        if (permission.startsWith(requiredPerission + '.') || requiredPerission === permission) {
            return true;
        }
        if (permission.endsWith('.*')) {
            let wildecardPermissionRoot = permission.substring(0, permission.length - 2);
            if (requiredPerission.startsWith(wildecardPermissionRoot + '.') || requiredPerission === wildecardPermissionRoot) {
                return true;
            }
        }
    }
    return false;
}
