import { execAsync, spawnAsync } from "./cli"
import { config } from "./config"

const getInstalled = async () =>
    (await flatpakExec("list", "--app", "--columns", "application"))
        .split("\n")
        .filter((line) => line.length)

const mask = async (remove: boolean = false) =>
    await execAsync(
        "pkexec",
        "flatpak",
        "mask",
        ...(remove ? ["--remove"] : []),
        "*",
        "--system"
    )

export const install = async () => {
    const [installedFlatpaks] = await getInstalled()
    const pkgsToInstall = config.pkgs.filter(
        (pkg) => !installedFlatpaks.includes(pkg.id)
    )

    if (pkgsToInstall.length)
        await flatpakSpawn("install", ...pkgsToInstall.map((pkg) => pkg.id))
}

export const uninstall = async () => {
    const installedFlatpaks = await getInstalled()
    const packagesToUninstall = installedFlatpaks.filter(
        (id) => !config.pkgs.find((pkg) => pkg.id == id)
    )

    if (packagesToUninstall.length)
        await flatpakSpawn("uninstall", ...packagesToUninstall)
}

export const upgrade = async () => {
    if (config.pkgs.length) {
        try {
            try {
                await mask(true)
            } catch {}
            for (const pkg of config.pkgs) {
                const commit = await flatpakExec(
                    "info",
                    pkg.id,
                    "| grep 'Commit: ' | sed 's/^.*: //'"
                )

                await spawnAsync(
                    "pkexec",
                    "flatpak",
                    "--system",
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

export const flatpakSpawn = (...cmd: string[]) =>
    spawnAsync("flatpak", ...cmd, "--noninteractive", "--system")

export const flatpakExec = (...cmd: string[]) =>
    execAsync("flatpak", ...cmd, "--system")
