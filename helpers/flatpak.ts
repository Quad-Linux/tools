import chalk from "chalk"
import Config from "../models/config"
import { execAsync } from "./cli"

const getInstalled = async () =>
    (await flatpakExec("list --app --columns application"))
        .split("\n")
        .filter((line) => line.length) ?? []

export const install = async (config: Config) => {
    const installedFlatpaks = await getInstalled()
    const pkgsToInstall = config.pkgs.filter(
        (pkg) => !installedFlatpaks.includes(pkg.id)
    )

    if (pkgsToInstall.length)
        await flatpakExecNoninteractive(
            `install ${pkgsToInstall.map((pkg) => pkg.id).join(" ")}`
        )
}

export const uninstall = async (config: Config) => {
    const installedFlatpaks = await getInstalled()
    const packagesToUninstall = installedFlatpaks.filter(
        (id) => !config.pkgs.find((pkg) => pkg.id == id)
    )

    if (packagesToUninstall.length)
        await flatpakExecNoninteractive(
            `uninstall ${packagesToUninstall.join(" ")}`
        )
}

export const upgrade = async (config: Config) => {
    if (config.pkgs.length) {
        try {
            const commands = await Promise.all(
                config.pkgs.map(async (pkg) => {
                    const commit = (
                        await execAsync(
                            `flatpak remote-info --log ${pkg.origin} ${pkg.id} --system | grep 'Commit: ${pkg.commit}' | sed 's/^.*: //'`
                        )
                    ).replace("\n", "")

                    if (!commit)
                        throw chalk.red.bold("Invalid commit provided!")

                    return `flatpak update --system --noninteractive ${pkg.id} --commit ${commit}`
                })
            )

            const mask = `flatpak mask "*"`

            await execAsync(
                `pkexec /usr/bin/env bash -c "${mask} --remove; ${commands.join(
                    " && "
                )}; ${mask}"`
            )
        } catch (error) {
            if (!error.includes("No current masked pattern matching *"))
                throw error
        }
    }
}

export const flatpakExecNoninteractive = (cmd: string) =>
    flatpakExec(`${cmd} --noninteractive`)

export const flatpakExec = (cmd: string) => execAsync(`flatpak ${cmd} --system`)
