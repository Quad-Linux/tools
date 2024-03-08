import Config from "../models/config"
import { execAsync } from "./cli"

const getInstalled = async () =>
    (await flatpakExec("list", "--app", "--columns", "application"))
        .split("\n")
        .filter((line) => line.length) ?? []

const mask = async (remove: boolean = false) =>
    await execAsync(
        "pkexec",
        "flatpak",
        "mask",
        ...(remove ? ["--remove"] : []),
        "*",
        "--system"
    )

export const install = async (config: Config) => {
    const installedFlatpaks = await getInstalled()
    const pkgsToInstall = config.pkgs.filter(
        (pkg) => !installedFlatpaks.includes(pkg.id)
    )

    if (pkgsToInstall.length)
        await flatpakExecNoninteractive(
            "install",
            ...pkgsToInstall.map((pkg) => pkg.id)
        )
}

export const uninstall = async (config: Config) => {
    const installedFlatpaks = await getInstalled()
    const packagesToUninstall = installedFlatpaks.filter(
        (id) => !config.pkgs.find((pkg) => pkg.id == id)
    )

    if (packagesToUninstall.length)
        await flatpakExecNoninteractive("uninstall", ...packagesToUninstall)
}

export const upgrade = async (config: Config) => {
    if (config.pkgs.length) {
        try {
            try {
                await mask(true)
            } catch {}
            for (const pkg of config.pkgs) {
                const commit = await execAsync(
                    "flatpak",
                    "info",
                    pkg.id,
                    "--system",
                    "| grep 'Commit: ' | sed 's/^.*: //'"
                )

                await execAsync(
                    "pkexec",
                    "flatpak",
                    "--system",
                    "--noninteractive",
                    "update",
                    pkg.id,
                    "--commit",
                    commit
                )
            }
        } finally {
            await mask()
        }
    }
}

export const flatpakExecNoninteractive = (...cmd: string[]) =>
    flatpakExec(...cmd, "--noninteractive")

export const flatpakExec = (...cmd: string[]) =>
    execAsync("flatpak", ...cmd, "--system")
