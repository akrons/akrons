import { Groups } from '../models/groups';
import { Users } from '../models/users';
import { Environment } from './env';

const ADMIN_USER_LOGIN_NAME = 'admin';

export async function ensureInitialAuth(): Promise<void> {
    const exists = await Users.getInstance().userWithLoginExists(ADMIN_USER_LOGIN_NAME);
    if (exists) {
        return;
    }
    console.log(`Creating default admin user.`);
    const adminGroup = await Groups.getInstance().create(undefined, {
        name: 'admin',
        permissions: ['api.auth.*']
    });
    const adminUser = await Users.getInstance().create(undefined, {
        login: ADMIN_USER_LOGIN_NAME,
        groups: [adminGroup.id]
    });
    await Users.getInstance().setPassword(adminUser, Environment.get().adminDefaultPassword, true);
}
