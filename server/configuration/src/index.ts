import yargs from "yargs";
import { loadConfigFile } from './load-config-files';

const CONSOLE_HELP_WIDTH = 110;


function getNewYargsInstance(): yargs.Argv {
    // https://github.com/yargs/yargs/issues/1639
    // eslint-disable-next-line
    return require("yargs")();
}

export async function loadConfiguration<T>(
    configBuilder: ((yargs: yargs.Argv<{}>) => yargs.Argv<T>),
    defaultConfig?: string,
    args?: string[]
): Promise<{ [key in keyof yargs.Arguments<T>]: yargs.Arguments<T>[key] }> {
    const yargsInstance = getNewYargsInstance();
    const configOptions = yargs
        .env("AKRONS")
        .option("config", {
            type: "string",
            demandOption: true,
        })
        .default("config", defaultConfig)
        .wrap(CONSOLE_HELP_WIDTH)
        .parse(args ? args : process.argv);
    const parsedConfig = await loadConfigFile(configOptions.config!, [], defaultConfig);
    return configBuilder(
        yargsInstance
            .env("SESAMED")
            .parserConfiguration({
                "camel-case-expansion": false
            })
            .config("config", (configPath) => {
                return parsedConfig;
            })
            .option("config", {
                alias: "c",
                env: "CONFIG",
                type: "string",
                description: "The entry config file."
            })
            .demandOption("config")
            .wrap(CONSOLE_HELP_WIDTH)
    ).parse(args ? args : process.argv);
}
export type ArgsBuilder<T> = yargs.Argv<T>;
