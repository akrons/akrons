import { loadConfiguration } from '@akrons/configuration';
import { Environment as DefaultEnvironment, ITimeSpan } from '@akrons/service-utils';


export class Environment {
    private static instance: IEnvironment | undefined;
    private constructor() { }

    static async loadEnvironment(): Promise<IEnvironment> {
        Environment.instance = await loadConfiguration(yargs => {
            return DefaultEnvironment.buildDefaultEnvironmentParameters(
                DefaultEnvironment.buildIMongoEnvironmentParameters(
                    DefaultEnvironment.buildIRedisEnvironmentParameters(
                        DefaultEnvironment.buildTimeSpanParameters(
                            DefaultEnvironment.buildTimeSpanParameters(
                                yargs
                                    .option('adminDefaultPassword', {
                                        type: 'string',
                                        demandOption: true
                                    })
                                    .option('defaultPasswordLength', {
                                        type: 'number',
                                        default: 10
                                    })
                                    .option('corsOrigins', {
                                        type: 'array',
                                        demandOption: true,
                                    })
                                ,
                                'sessionTokenValidity', false, { min: 5 }
                            ),
                            'sessionTokenRenewability', false, { days: 1 }
                        ),
                    ),
                ),
            );
        });
        return Environment.instance;
    }

    static get(): IEnvironment {
        if (!Environment.instance) {
            throw new Error(`Environment not loaded. Please call loadEnvironment() first!`);
        }
        return Environment.instance;
    }

}

export interface IEnvironment extends
    DefaultEnvironment.IDefaultEnvironment,
    DefaultEnvironment.IMongoEnvironment,
    DefaultEnvironment.IRedisEnvironment {
    sessionTokenValidity: ITimeSpan;
    sessionTokenRenewability: ITimeSpan;
    adminDefaultPassword: string;
    defaultPasswordLength: number;
    corsOrigins: (string | number)[];
}
