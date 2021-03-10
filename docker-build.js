const { spawn } = require("child_process");
const { promises } = require("fs");
const { readFile } = promises;

function run(executable, args) {
    console.log([executable, ...args].join(' '))
    return (new Promise((resolve, reject) => {
        let childProcess = spawn(executable, args, {
            stdio: [
                "inherit", // StdIn.
                "inherit",    // StdOut.
                "inherit",    // StdErr.
            ],
        });
        childProcess.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`The command '${executable}', exited with the unsuccessful statuscode '${code}'.`));
            }
            resolve(undefined);
        });
    }));
}

async function main() {
    let service;
    let tagLatest = false;
    let registry;
    let organization = "akrons";
    for (let i = 1; i < process.argv.length; i++) {
        switch (process.argv[i]) {
            case '--service':
                service = process.argv[++i];
                break
            case '--organization':
                organization = process.argv[++i];
                break
            case '--latest':
                tagLatest = true;
                break
            case '--registry':
                registry = process.argv[++i];
                break
            case '--help':
                console.log(
                    `options:\n` +
                    '\t--service <name> [required] Name of the service to build the image for\n' +
                    '\t--organization <name> Name of the organization fot the image\n' +
                    '\t--latest should the image also be tagged as latest\n' +
                    '\t--registry <url> optional docker registry\n' +
                    '\t--help show help\n'
                );
                process.exit(1);
                break
        }
    }
    if (service.length < 2) {
        service = service + '-package'
    }
    const lernaJson = (await readFile("package.json")).toString();
    const version = JSON.parse(lernaJson).version;
    const tagName = `${registry ? registry + '/' : ''}${organization}/${service}`;
    const buildTag = `${tagName}:${version}`;
    await run("docker", ["build", "-t", buildTag, "-f", "../../Dockerfile", "."]);
    await run("docker", ["push", buildTag]);
    if (tagLatest) {
        const latestTag = `${tagName}:latest`;
        await tagAndPush(buildTag, latestTag);
        if (version.match(/^[0-9]+\.[0-9]+\.[0-9]$/gm)) {
            const [major, minor, patch] = version.split('.');
            await tagAndPush(buildTag, `${tagName}:${major}.${minor}`);
            await tagAndPush(buildTag, `${tagName}:${major}`);
        }
    }
}

async function tagAndPush(baseTag, pushAs) {
    console.log(`push tag ${baseTag} as tag ${pushAs}.`)
    await run("docker", ["tag", baseTag, pushAs]);
    await run("docker", ["push", pushAs]);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
