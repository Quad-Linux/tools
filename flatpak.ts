import chalk from "chalk"
import { Config } from "@quados/models"
import { homedir } from "os"
import { writeFile, symlink, unlink } from "fs/promises"
import { join } from "path"
import {
    flatpakExec,
    flatpakExecNoninteractive,
    execAsync,
    parseList,
    flatpakAddPermission,
} from "@quados/helpers"

const getInstalled = async () =>
    (await flatpakExec("list --app --columns application"))
        .split("\n")
        .filter((line) => line.length) ?? []

export const install = async (config: Config) => {
    const installedFlatpaks = await getInstalled()
    const pkgsToInstall = config.pkgs.filter(
        (pkg) => !installedFlatpaks.includes(pkg.id)
    )

    if (pkgsToInstall.length) {
        await flatpakExecNoninteractive(
            `install ${pkgsToInstall.map((pkg) => pkg.id).join(" ")}`
        )

        try {
            const mask = `pkexec flatpak mask "*"`
            await execAsync(`${mask} --remove`)

            for (const pkg of config.pkgs) {
                const commit = (
                    await execAsync(
                        `flatpak remote-info --log ${pkg.origin} ${pkg.id} --system | grep 'Commit: ${pkg.commit}' | sed 's/^.*: //'`
                    )
                ).replace("\n", "")

                if (!commit) throw chalk.red.bold("Invalid commit provided!")

                await execAsync(
                    `pkexec flatpak update ${pkg.id} --commit ${commit} --noninteractive --system`
                )
            }

            await execAsync(mask)
        } catch (error) {
            if (!error.includes("No current masked pattern matching *"))
                throw error
        }
    }
}

// export const configure = async (config: Config) => {
//     for (const pkg of config.pkgs) {
//         const localBin = join(homedir(), ".local", "bin")
//         await execAsync(`mkdir -p ${localBin}`)
//         await writeFile(
//             join(localBin, pkg.name),
//             `#!/usr/bin/env bash
// exec flatpak run ${pkg.id} "$@"`,
//             { mode: 0o755 }
//         )

//         const configFolder = join(homedir(), ".var", "app", pkg.id, "config")
//         await execAsync(`mkdir -p ${configFolder}`)

//         for (const configSymlink in pkg.config.symlinks) {
//             const sym = pkg.config.symlinks[configSymlink]
//             try {
//                 await symlink(sym.source, join(configFolder, configSymlink))
//             } catch {}
//             await flatpakAddPermission(
//                 pkg.id,
//                 configSymlink,
//                 sym.readonly ?? false
//             )
//         }

//         for (const configFile in pkg.config.files) {
//             const file = pkg.config.files[configFile]
//             await writeFile(join(configFolder, configFile), file.source)
//             await flatpakAddPermission(
//                 pkg.id,
//                 configFile,
//                 file.readonly ?? false
//             )
//         }
//     }
// }
